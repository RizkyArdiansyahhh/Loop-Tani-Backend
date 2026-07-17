import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CloudinaryService } from '../../infra/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

/** Allowed MIME types for avatar uploads */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
]);

/** Max avatar size: 2 MB */
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

/** JPEG magic bytes */
const JPEG_MAGIC = [0xff, 0xd8, 0xff];
/** PNG magic bytes */
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ─── Public API ─────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.findUserOrThrow(userId);
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findUserOrThrow(userId);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      include: { sellerProfile: true, roles: true },
    });

    return this.sanitizeUser(updated);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    this.validateAvatarFile(file);

    const user = await this.findUserOrThrow(userId);

    // Delete previous Cloudinary asset if one exists
    if (user.avatarPublicId) {
      await this.cloudinary.delete(user.avatarPublicId);
    }

    const folder = `loop-tani/avatars/${userId}`;
    const result = await this.cloudinary.upload(file.buffer, folder);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        image: result.secure_url,
        avatarPublicId: result.public_id,
      },
      include: { sellerProfile: true, roles: true },
    });

    return this.sanitizeUser(updated);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async findUserOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true, roles: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Validates mime type, file size, and magic bytes.
   * Throws BadRequestException on any violation.
   */
  private validateAvatarFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // 1. MIME type check
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type "${file.mimetype}". Only JPEG and PNG are allowed.`,
      );
    }

    // 2. File size check
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      throw new BadRequestException(
        `File size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds the 2 MB limit.`,
      );
    }

    // 3. Magic bytes check (prevent MIME spoofing)
    const bytes = Array.from(file.buffer.subarray(0, 4));

    const isJpeg = JPEG_MAGIC.every((b, i) => bytes[i] === b);
    const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b);

    if (!isJpeg && !isPng) {
      throw new BadRequestException(
        'File content does not match a valid image format.',
      );
    }
  }

  /**
   * Strips sensitive fields before returning user to client.
   */
  private sanitizeUser(
    user: Awaited<ReturnType<typeof this.findUserOrThrow>>,
  ) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map((r) => r.role),
      sellerProfile: user.sellerProfile
        ? {
            id: user.sellerProfile.id,
            storeName: user.sellerProfile.storeName,
            storeSlug: user.sellerProfile.storeSlug,
            logoUrl: user.sellerProfile.logoUrl,
            status: user.sellerProfile.status,
          }
        : null,
    };
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
