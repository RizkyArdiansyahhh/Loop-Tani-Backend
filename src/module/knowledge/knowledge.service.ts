import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { CompleteContentDto } from './dto/complete-content.dto';
import { GetContentsDto } from './dto/get-contents.dto';
import { ContentStatus, ContentType, PointTier, PointTransactionType } from '@prisma/client';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper to generate a unique slug
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const existing = await this.prisma.knowledgeContent.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) break;

      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  // Helper to calculate estimated reading time based on word count
  private calculateEstimatedReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    // Avg reading speed: 200 words per minute
    return Math.max(1, Math.ceil(words / 200));
  }

  // Create content (Admin/Seller)
  async create(userId: string, dto: CreateContentDto) {
    // Assert user role permits this action
    const userRole = await this.prisma.userRole.findFirst({
      where: { userId },
    });

    const slug = await this.generateUniqueSlug(dto.title);

    let estimatedReadingMinutes = dto.estimatedReadingMinutes;
    if (dto.type === ContentType.ARTICLE && !estimatedReadingMinutes) {
      estimatedReadingMinutes = this.calculateEstimatedReadingTime(dto.content);
    }

    // Default status for sellers is PENDING_REVIEW, admins can set it directly
    let status = dto.status ?? ContentStatus.DRAFT;
    if (userRole?.role === 'SELLER') {
      status = ContentStatus.PENDING_REVIEW;
      if (dto.type === ContentType.VIDEO) {
        throw new ForbiddenException('Seller tidak diperbolehkan mengupload video.');
      }
    }

    const content = await this.prisma.knowledgeContent.create({
      data: {
        type: dto.type,
        title: dto.title,
        slug,
        content: dto.content,
        category: dto.category,
        difficulty: dto.difficulty,
        imageUrl: dto.imageUrl,
        rewardPoint: dto.rewardPoint ?? 20,
        estimatedReadingMinutes,
        videoDuration: dto.videoDuration,
        cloudinaryPublicId: dto.cloudinaryPublicId,
        secureUrl: dto.secureUrl,
        thumbnailUrl: dto.thumbnailUrl,
        status,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, roles: { select: { role: true } } },
        },
      },
    });

    return this.serializeContent(content);
  }

  // Find all contents
  async findAll(dto: GetContentsDto) {
    const { page, limit, search, type, category, difficulty } = dto;
    const skip = (page - 1) * limit;

    const where: any = {
      status: ContentStatus.PUBLISHED,
      ...(type && { type }),
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.knowledgeContent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, image: true, roles: { select: { role: true } } },
          },
        },
      }),
      this.prisma.knowledgeContent.count({ where }),
    ]);

    return {
      data: data.map((item) => this.serializeContent(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Find one content details
  async findOne(idOrSlug: string, userId?: string) {
    const content = await this.prisma.knowledgeContent.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, roles: { select: { role: true } } },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('Konten panduan tani tidak ditemukan.');
    }

    let progress: any = null;
    if (userId) {
      progress = await this.prisma.learningProgress.findUnique({
        where: {
          userId_contentId: {
            userId,
            contentId: content.id,
          },
        },
      });
    }

    return {
      ...this.serializeContent(content),
      progress: progress
        ? {
            scrollPercentage: progress.scrollPercentage,
            activeReadingSeconds: progress.activeReadingSeconds,
            watchedPercentage: progress.watchedPercentage,
            completed: progress.completed,
            rewardClaimed: progress.rewardClaimed,
            completedAt: progress.completedAt,
          }
        : null,
    };
  }

  // Complete endpoint logic
  async complete(contentId: string, userId: string, dto: CompleteContentDto) {
    const content = await this.prisma.knowledgeContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Konten panduan tani tidak ditemukan.');
    }

    // Check existing progress
    let progress = await this.prisma.learningProgress.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    if (progress?.completed) {
      return {
        completed: true,
        canClaim: !progress.rewardClaimed,
      };
    }

    // Validate thresholds
    let meetsThreshold = false;

    if (content.type === ContentType.ARTICLE) {
      const scrollPercentage = dto.scrollPercentage ?? 0;
      const activeReadingSeconds = dto.activeReadingSeconds ?? 0;

      // Scroll >= 90% AND activeReadingSeconds >= 70% of estimated reading time
      const estimatedSecs = (content.estimatedReadingMinutes ?? 5) * 60;
      const requiredReadingSecs = estimatedSecs * 0.7;

      if (scrollPercentage >= 90 && activeReadingSeconds >= requiredReadingSecs) {
        meetsThreshold = true;
      }
    } else if (content.type === ContentType.VIDEO) {
      const watchedPercentage = dto.watchedPercentage ?? 0;

      // Watch >= 80%
      if (watchedPercentage >= 80) {
        meetsThreshold = true;
      }
    }

    // Upsert progress
    progress = await this.prisma.learningProgress.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
      create: {
        userId,
        contentId,
        scrollPercentage: dto.scrollPercentage ?? 0,
        activeReadingSeconds: dto.activeReadingSeconds ?? 0,
        watchedPercentage: dto.watchedPercentage ?? 0,
        completed: meetsThreshold,
        completedAt: meetsThreshold ? new Date() : null,
      },
      update: {
        scrollPercentage: Math.max(progress?.scrollPercentage ?? 0, dto.scrollPercentage ?? 0),
        activeReadingSeconds: Math.max(progress?.activeReadingSeconds ?? 0, dto.activeReadingSeconds ?? 0),
        watchedPercentage: Math.max(progress?.watchedPercentage ?? 0, dto.watchedPercentage ?? 0),
        ...(meetsThreshold && !progress?.completed
          ? {
              completed: true,
              completedAt: new Date(),
            }
          : {}),
      },
    });

    return {
      completed: progress.completed,
      canClaim: progress.completed && !progress.rewardClaimed,
    };
  }

  // Claim LoopPoints logic using transaction
  async claim(contentId: string, userId: string) {
    const content = await this.prisma.knowledgeContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Konten panduan tani tidak ditemukan.');
    }

    const progress = await this.prisma.learningProgress.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    if (!progress) {
      throw new BadRequestException('Progress belajar tidak ditemukan.');
    }

    if (!progress.completed) {
      throw new BadRequestException('Selesaikan membaca/menonton konten terlebih dahulu sebelum klaim.');
    }

    if (progress.rewardClaimed) {
      throw new ConflictException('Reward poin untuk konten ini sudah diklaim.');
    }

    const rewardPoint = content.rewardPoint;

    // Run within atomic Prisma transaction
    const transactionResult = await this.prisma.$transaction(async (tx) => {
      // 1. Mark reward claimed in LearningProgress
      await tx.learningProgress.update({
        where: {
          userId_contentId: {
            userId,
            contentId,
          },
        },
        data: {
          rewardClaimed: true,
        },
      });

      // 2. Add PointTransaction
      await tx.pointTransaction.create({
        data: {
          userId,
          amount: rewardPoint,
          type: PointTransactionType.EARN,
          description: `Klaim poin dari ${content.type === ContentType.ARTICLE ? 'Artikel' : 'Video'}: ${content.title}`,
          sourceId: contentId,
          sourceType: 'KNOWLEDGE_CONTENT',
        },
      });

      // 3. Upsert UserPointAccount
      const pointAccount = await tx.userPointAccount.upsert({
        where: { userId },
        create: {
          userId,
          totalPoint: rewardPoint,
          lifetimePoint: rewardPoint,
          tier: this.calculateTier(rewardPoint),
        },
        update: {
          totalPoint: { increment: rewardPoint },
          lifetimePoint: { increment: rewardPoint },
        },
      });

      // Recalculate tier after incremental update
      const updatedTier = this.calculateTier(pointAccount.lifetimePoint);
      const finalAccount = await tx.userPointAccount.update({
        where: { userId },
        data: { tier: updatedTier },
      });

      return finalAccount;
    });

    return {
      pointsEarned: rewardPoint,
      totalPoints: transactionResult.totalPoint,
      tier: transactionResult.tier,
    };
  }

  // Get user's learning progress directly
  async getProgress(contentId: string, userId: string) {
    const progress = await this.prisma.learningProgress.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
    });

    return progress ?? {
      scrollPercentage: 0,
      activeReadingSeconds: 0,
      watchedPercentage: 0,
      completed: false,
      rewardClaimed: false,
    };
  }

  // Delete content (Admin/Author only)
  async remove(id: string, userId: string) {
    const content = await this.prisma.knowledgeContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Konten tidak ditemukan.');
    }

    const userRole = await this.prisma.userRole.findFirst({
      where: { userId },
    });

    if (userRole?.role !== 'ADMIN' && content.authorId !== userId) {
      throw new ForbiddenException('Anda tidak berwenang menghapus konten ini.');
    }

    await this.prisma.knowledgeContent.delete({ where: { id } });
    return { message: 'Konten berhasil dihapus.' };
  }

  // Helper to determine tier from lifetime points
  private calculateTier(lifetimePoints: number): PointTier {
    if (lifetimePoints >= 2500) return PointTier.PLATINUM;
    if (lifetimePoints >= 1000) return PointTier.GOLD;
    if (lifetimePoints >= 300) return PointTier.SILVER;
    return PointTier.BRONZE;
  }

  // Serialization helper to map database structure to frontend expectations
  private serializeContent(item: any) {
    const authorRole = item.author?.roles?.[0]?.role ?? 'BUYER';
    let roleLabel = 'Petani Mitra';
    if (authorRole === 'ADMIN') roleLabel = 'Admin LoopTani';
    else if (authorRole === 'SELLER') roleLabel = 'Petani Ahli';

    return {
      id: item.id,
      slug: item.slug,
      type: item.type === ContentType.ARTICLE ? 'artikel' : 'video',
      title: item.title,
      category: item.category,
      difficulty: item.difficulty,
      imageUrl: item.imageUrl,
      points: item.rewardPoint,
      duration:
        item.type === ContentType.ARTICLE
          ? `${item.estimatedReadingMinutes} menit baca`
          : this.formatVideoDuration(item.videoDuration),
      content: item.content,
      youtubeId: item.type === ContentType.VIDEO ? item.secureUrl : undefined, // secureUrl acts as streaming endpoint
      cloudinaryPublicId: item.cloudinaryPublicId,
      secureUrl: item.secureUrl,
      thumbnailUrl: item.thumbnailUrl,
      status: item.status,
      createdAt: item.createdAt,
      uploader: {
        id: item.author.id,
        name: item.author.name,
        avatarUrl: item.author.image,
        role: roleLabel,
      },
    };
  }

  private formatVideoDuration(seconds?: number): string {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
