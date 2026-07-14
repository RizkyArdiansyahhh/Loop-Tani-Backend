import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { SimulateApproveDto } from './dto/simulate-approve.dto';
import { SellerStatus, Role } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

  async getSellerMe(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        storeName: true,
        storeSlug: true,
        description: true,
        province: true,
        city: true,
        address: true,
        postalCode: true,
        phone: true,
        logoUrl: true,
        status: true,
        createdAt: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Seller profile not found');
    }

    return profile;
  }

  async registerSeller(userId: string, dto: RegisterSellerDto) {
    // 1. Check duplicate profile
    const existingProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User is already registered as a seller');
    }

    // 2. Validate unique store slug
    const slugLower = dto.storeSlug.trim().toLowerCase();
    const existingSlug = await this.prisma.sellerProfile.findFirst({
      where: { storeSlug: slugLower },
    });

    if (existingSlug) {
      throw new ConflictException('Store slug is already taken');
    }

    // 3. Create profile
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.sellerProfile.create({
        data: {
          userId,
          storeName: dto.storeName.trim(),
          storeSlug: slugLower,
          description: dto.description?.trim(),
          province: dto.province?.trim(),
          city: dto.city?.trim(),
          address: dto.address?.trim(),
          postalCode: dto.postalCode?.trim(),
          phone: dto.phone?.trim(),
          status: SellerStatus.PENDING,
        },
      });

      return profile;
    });
  }

  async getDashboard(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ForbiddenException('Seller profile does not exist. Please register first.');
    }

    if (profile.status !== SellerStatus.ACTIVE) {
      throw new ForbiddenException(`Seller dashboard is inaccessible because store status is ${profile.status}`);
    }

    // Fetch active products count from DB
    const totalProducts = await this.prisma.product.count({
      where: { sellerId: userId },
    });

    const activeProducts = await this.prisma.product.count({
      where: { sellerId: userId, status: 'ACTIVE' },
    });

    // Fetch low stock products (stock < 5)
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        sellerId: userId,
        stock: { lt: 5 },
      },
      select: {
        id: true,
        title: true,
        stock: true,
        price: true,
      },
    });

    // Mock analytical data
    const stats = {
      todayRevenue: 1850000,
      monthlyRevenue: 48900000,
      ordersCount: 36,
      visitorsCount: 1420,
      conversionRate: '7.8%',
      totalProducts,
      activeProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders: [
        { id: '1', buyer: 'Ahmad Setiawan', total: 450000, status: 'PROCESSED', date: new Date().toISOString() },
        { id: '2', buyer: 'Dewi Lestari', total: 120000, status: 'PENDING', date: new Date().toISOString() },
        { id: '3', buyer: 'Budi Saputra', total: 850000, status: 'SHIPPED', date: new Date().toISOString() },
      ],
      recentReviews: [
        { id: '1', reviewer: 'Ahmad Setiawan', rating: 5, comment: 'Sangat puas dengan kualitas kompos organiknya!', date: new Date().toISOString() },
        { id: '2', reviewer: 'Lia Rahmawati', rating: 4, comment: 'Respon penjual cepat, produk oke.', date: new Date().toISOString() },
      ],
    };

    return stats;
  }

  async simulateApprove(userId: string, dto: SimulateApproveDto) {
    // 1. Verify Demo Mode
    const isDemo = process.env.ENABLE_DEMO_MODE === 'true';
    const isDev = process.env.NODE_ENV !== 'production';

    if (!isDemo && !isDev) {
      throw new ForbiddenException('Simulation endpoints are disabled in production mode.');
    }

    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Seller profile not found to simulate approval');
    }

    // 2. Perform Transaction to update status and handle Roles
    return this.prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.sellerProfile.update({
        where: { userId },
        data: { status: dto.status },
      });

      if (dto.status === SellerStatus.ACTIVE) {
        // Upsert SELLER role
        await tx.userRole.upsert({
          where: {
            userId_role: { userId, role: Role.SELLER },
          },
          create: { userId, role: Role.SELLER },
          update: {},
        });
      } else {
        // Remove SELLER role
        await tx.userRole.deleteMany({
          where: { userId, role: Role.SELLER },
        });
      }

      return updatedProfile;
    });
  }
}
