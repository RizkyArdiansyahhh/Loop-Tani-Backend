import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { PointTier } from '@prisma/client';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  // Find or create UserPointAccount
  async getAccount(userId: string) {
    return this.prisma.userPointAccount.upsert({
      where: { userId },
      create: {
        userId,
        totalPoint: 0,
        lifetimePoint: 0,
        tier: PointTier.BRONZE,
      },
      update: {},
    });
  }

  // Get point transactions
  async getTransactions(userId: string, dto: GetTransactionsDto) {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pointTransaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pointTransaction.count({
        where: { userId },
      }),
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
