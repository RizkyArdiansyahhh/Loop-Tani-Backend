import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { VerifySellerDto } from './dto/verify-seller.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Role, SellerStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Verification Helper ──────────────────────────────────────────────────

  async validateAdminOrThrow(userId: string): Promise<void> {
    const adminRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        role: Role.ADMIN,
      },
    });

    if (!adminRole) {
      throw new ForbiddenException('Akses ditolak. Peran ADMIN diperlukan.');
    }
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboard(adminId: string) {
    await this.validateAdminOrThrow(adminId);

    const [
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalArticles,
      totalVideos,
      pointsAggregate,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.sellerProfile.count({ where: { status: SellerStatus.ACTIVE } }),
      this.prisma.sellerProfile.count({ where: { status: SellerStatus.PENDING } }),
      this.prisma.product.count(),
      this.prisma.knowledgeContent.count({ where: { type: 'ARTICLE' } }),
      this.prisma.knowledgeContent.count({ where: { type: 'VIDEO' } }),
      this.prisma.userPointAccount.aggregate({
        _sum: { totalPoint: true },
      }),
    ]);

    return {
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalArticles,
      totalVideos,
      totalPoints: pointsAggregate._sum.totalPoint ?? 0,
    };
  }

  // ─── User Management ──────────────────────────────────────────────────────

  async getUsers(
    adminId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    await this.validateAdminOrThrow(adminId);

    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: { select: { role: true } },
          sellerProfile: { select: { id: true, storeName: true, status: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const sanitized = data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      image: u.image,
      isActive: u.isActive,
      createdAt: u.createdAt,
      roles: u.roles.map((r) => r.role),
      sellerProfile: u.sellerProfile,
    }));

    return {
      data: sanitized,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(
    adminId: string,
    targetUserId: string,
    dto: UpdateUserStatusDto,
  ) {
    await this.validateAdminOrThrow(adminId);

    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: dto.isActive },
    });
  }

  async updateUserRoles(
    adminId: string,
    targetUserId: string,
    dto: UpdateUserRolesDto,
  ) {
    await this.validateAdminOrThrow(adminId);

    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Run in transaction to replace current roles
    await this.prisma.$transaction(async (tx) => {
      // 1. Delete all current roles
      await tx.userRole.deleteMany({ where: { userId: targetUserId } });

      // 2. Add new roles
      if (dto.roles.length > 0) {
        await tx.userRole.createMany({
          data: dto.roles.map((r) => ({
            userId: targetUserId,
            role: r,
          })),
        });
      }
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { roles: true },
    });

    return {
      id: updatedUser?.id,
      name: updatedUser?.name,
      roles: updatedUser?.roles.map((r) => r.role),
    };
  }

  // ─── Seller Verification ──────────────────────────────────────────────────

  async getSellers(adminId: string, status?: SellerStatus) {
    await this.validateAdminOrThrow(adminId);

    return this.prisma.sellerProfile.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }

  async verifySeller(
    adminId: string,
    targetSellerUserId: string,
    dto: VerifySellerDto,
  ) {
    await this.validateAdminOrThrow(adminId);

    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId: targetSellerUserId },
    });

    if (!profile) {
      throw new NotFoundException('Profil seller tidak ditemukan');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.sellerProfile.update({
        where: { userId: targetSellerUserId },
        data: {
          status: dto.status,
          rejectionReason: dto.status === SellerStatus.REJECTED ? dto.rejectionReason : null,
        },
      });

      if (dto.status === SellerStatus.ACTIVE) {
        // Assign SELLER role
        await tx.userRole.upsert({
          where: {
            userId_role: { userId: targetSellerUserId, role: Role.SELLER },
          },
          create: { userId: targetSellerUserId, role: Role.SELLER },
          update: {},
        });
      } else {
        // Remove SELLER role
        await tx.userRole.deleteMany({
          where: { userId: targetSellerUserId, role: Role.SELLER },
        });
      }

      return updatedProfile;
    });
  }

  // ─── Category Management ──────────────────────────────────────────────────

  async getCategories(adminId: string) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(adminId: string, dto: CreateCategoryDto) {
    await this.validateAdminOrThrow(adminId);

    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Slug kategori sudah digunakan');
    }

    return this.prisma.category.create({ data: dto });
  }

  async updateCategory(
    adminId: string,
    id: string,
    dto: Partial<CreateCategoryDto>,
  ) {
    await this.validateAdminOrThrow(adminId);

    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('Slug kategori sudah digunakan');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(adminId: string, id: string) {
    await this.validateAdminOrThrow(adminId);

    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

    return this.prisma.category.delete({ where: { id } });
  }

  // ─── Knowledge Management ─────────────────────────────────────────────────

  async getKnowledge(adminId: string) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.knowledgeContent.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
      },
    });
  }

  async createKnowledge(adminId: string, dto: CreateKnowledgeDto) {
    await this.validateAdminOrThrow(adminId);

    const slug = dto.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const existing = await this.prisma.knowledgeContent.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Judul menghasilkan slug yang sudah ada. Pilih judul lain.');
    }

    return this.prisma.knowledgeContent.create({
      data: {
        ...dto,
        slug,
        authorId: adminId,
        status: 'PUBLISHED', // Auto publish when created by Admin
      },
    });
  }

  async updateKnowledge(
    adminId: string,
    id: string,
    dto: Partial<CreateKnowledgeDto>,
  ) {
    await this.validateAdminOrThrow(adminId);

    const content = await this.prisma.knowledgeContent.findUnique({ where: { id } });
    if (!content) throw new NotFoundException('Konten edukasi tidak ditemukan');

    let slug = content.slug;
    if (dto.title && dto.title !== content.title) {
      slug = dto.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const existing = await this.prisma.knowledgeContent.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Judul menghasilkan slug yang sudah ada. Pilih judul lain.');
      }
    }

    return this.prisma.knowledgeContent.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  async deleteKnowledge(adminId: string, id: string) {
    await this.validateAdminOrThrow(adminId);

    const content = await this.prisma.knowledgeContent.findUnique({ where: { id } });
    if (!content) throw new NotFoundException('Konten edukasi tidak ditemukan');

    return this.prisma.knowledgeContent.delete({ where: { id } });
  }

  // ─── Reward Management ────────────────────────────────────────────────────

  async getRewards(adminId: string) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.reward.findMany({
      orderBy: { pointsCost: 'asc' },
    });
  }

  async createReward(adminId: string, dto: CreateRewardDto) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.reward.create({ data: dto });
  }

  async updateReward(adminId: string, id: string, dto: Partial<CreateRewardDto>) {
    await this.validateAdminOrThrow(adminId);

    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward tidak ditemukan');

    return this.prisma.reward.update({
      where: { id },
      data: dto,
    });
  }

  async deleteReward(adminId: string, id: string) {
    await this.validateAdminOrThrow(adminId);

    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward tidak ditemukan');

    return this.prisma.reward.delete({ where: { id } });
  }

  // ─── Notification Management ──────────────────────────────────────────────

  async getNotifications(adminId: string) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNotification(adminId: string, dto: CreateNotificationDto) {
    await this.validateAdminOrThrow(adminId);
    return this.prisma.notification.create({ data: dto });
  }

  // ─── Point Transactions ───────────────────────────────────────────────────

  async getPointTransactions(
    adminId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    await this.validateAdminOrThrow(adminId);

    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { user: { name: { contains: search, mode: 'insensitive' as const } } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.pointTransaction.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
