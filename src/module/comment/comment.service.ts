import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { CommentStatus } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Create a comment or reply
  async create(userId: string, contentId: string, dto: CreateCommentDto) {
    // Validate target content exists and is PUBLISHED
    const content = await this.prisma.knowledgeContent.findFirst({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Konten edukasi tidak ditemukan');
    }
    if (content.status !== 'PUBLISHED') {
      throw new ForbiddenException('Tidak dapat mengomentari konten yang belum dipublikasikan');
    }

    // Validate parent comment if parentId is provided
    if (dto.parentId) {
      const parentComment = await this.prisma.comment.findFirst({
        where: { id: dto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Komentar utama tidak ditemukan');
      }
      if (parentComment.contentId !== contentId) {
        throw new BadRequestException('ID Konten parent tidak sesuai');
      }
      if (parentComment.parentId !== null) {
        throw new BadRequestException('Balasan hanya boleh 1-level (tidak dapat membalas balasan lain)');
      }
      if (parentComment.status === CommentStatus.DELETED || parentComment.status === CommentStatus.HIDDEN) {
        throw new BadRequestException('Tidak dapat membalas komentar yang telah dihapus atau disembunyikan');
      }
    }

    // Create comment
    const comment = await this.prisma.comment.create({
      data: {
        contentId,
        userId,
        parentId: dto.parentId ?? null,
        content: dto.content,
        status: CommentStatus.ACTIVE,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return comment;
  }

  // 2. Find paginated parent comments with replies
  async findAll(contentId: string, dto: GetCommentsDto, currentUserId?: string, isAdmin: boolean = false) {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    // Standard filter for non-admin: ACTIVE comments, and DELETED comments only if they have ACTIVE replies.
    // HIDDEN comments are never returned to non-admin.
    const statusFilter = isAdmin
      ? {
          // Admin can see everything except parent comments that are deleted and have no replies
          OR: [
            { status: CommentStatus.ACTIVE },
            { status: CommentStatus.HIDDEN },
            {
              status: CommentStatus.DELETED,
              replies: { some: {} },
            },
          ],
        }
      : {
          OR: [
            { status: CommentStatus.ACTIVE },
            {
              status: CommentStatus.DELETED,
              replies: {
                some: {
                  status: CommentStatus.ACTIVE,
                },
              },
            },
          ],
        };

    const where: any = {
      contentId,
      parentId: null,
      ...statusFilter,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // show newest first
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          replies: {
            where: isAdmin
              ? {} // Admin sees all replies
              : { status: CommentStatus.ACTIVE }, // Normal users see only active replies
            orderBy: { createdAt: 'asc' }, // Replies are chronological
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    // Format soft-deleted parent content placeholder
    const formattedData = data.map((item) => {
      if (item.status === CommentStatus.DELETED) {
        return {
          ...item,
          content: 'Komentar ini telah dihapus',
        };
      }
      return item;
    });

    return {
      data: formattedData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 3. Update a comment
  async update(userId: string, commentId: string, dto: UpdateCommentDto, isAdmin: boolean = false) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment || comment.status === CommentStatus.DELETED) {
      throw new NotFoundException('Komentar tidak ditemukan atau telah dihapus');
    }

    // Ownership check: must be the author (Admins can also edit, but normally users edit their own)
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Anda tidak berwenang mengedit komentar ini');
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return updated;
  }

  // 4. Soft Delete a comment
  async remove(userId: string, commentId: string, isAdmin: boolean = false) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment || comment.status === CommentStatus.DELETED) {
      throw new NotFoundException('Komentar tidak ditemukan atau telah dihapus');
    }

    // Ownership check: must be the author or admin
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Anda tidak berwenang menghapus komentar ini');
    }

    // Soft delete
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { status: CommentStatus.DELETED },
    });

    return { success: true };
  }

  // 5. Moderate a comment status (Admin only)
  async moderate(commentId: string, status: CommentStatus) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return updated;
  }

  // 6. Report a comment (Once per user per comment)
  async report(userId: string, commentId: string, reason?: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment || comment.status === CommentStatus.DELETED || comment.status === CommentStatus.HIDDEN) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    // Check existing report
    const existing = await this.prisma.commentReport.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Anda sudah melaporkan komentar ini sebelumnya');
    }

    await this.prisma.commentReport.create({
      data: {
        commentId,
        userId,
        reason,
      },
    });

    return { success: true };
  }
}
