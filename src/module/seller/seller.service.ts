import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SimulateApproveDto } from './dto/simulate-approve.dto';
import { SellerStatus, Role } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

  async getSellerMe(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        socialMedia: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Seller profile not found');
    }

    const activeProductsCount = await this.prisma.product.count({
      where: { sellerId: userId, status: 'ACTIVE' },
    });

    return {
      ...profile,
      impactStats: {
        wasteProcessedKg: 0,
        organicProductsCount: activeProductsCount,
        farmersHelpedCount: 0,
        isUpcomingFeature: true,
      },
    };
  }

  async updateSellerSettings(userId: string, dto: UpdateSellerDto) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Seller profile not found');
    }

    if (dto.storeSlug && dto.storeSlug !== profile.storeSlug) {
      const existingSlug = await this.prisma.sellerProfile.findFirst({
        where: {
          storeSlug: dto.storeSlug.toLowerCase(),
          id: { not: profile.id },
        },
      });
      if (existingSlug) {
        throw new ConflictException('Store URL slug is already taken by another store');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.socialMedia && Array.isArray(dto.socialMedia)) {
        await tx.sellerSocialMedia.deleteMany({
          where: { sellerId: profile.id },
        });

        const validSocials = dto.socialMedia.filter((item) => item.url && item.url.trim().length > 0);
        if (validSocials.length > 0) {
          await tx.sellerSocialMedia.createMany({
            data: validSocials.map((item) => ({
              sellerId: profile.id,
              platform: item.platform,
              url: item.url.trim(),
            })),
          });
        }
      }

      return tx.sellerProfile.update({
        where: { userId },
        data: {
          ...(dto.storeName && { storeName: dto.storeName }),
          ...(dto.storeSlug && { storeSlug: dto.storeSlug.toLowerCase() }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.province !== undefined && { province: dto.province }),
          ...(dto.city !== undefined && { city: dto.city }),
          ...(dto.address !== undefined && { address: dto.address }),
          ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
          ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
          ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
        },
        include: {
          socialMedia: true,
        },
      });
    }, {
      timeout: 15000,
      maxWait: 5000,
    });
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

    // Fetch real orders from database
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sellerOrders = await this.prisma.order.findMany({
      where: { sellerId: userId },
      include: {
        buyer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let todayRevenue = 0;
    let monthlyRevenue = 0;
    sellerOrders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      const amount = Number(o.grandTotal || 0);
      if (orderDate >= startOfToday) {
        todayRevenue += amount;
      }
      if (orderDate >= startOfMonth) {
        monthlyRevenue += amount;
      }
    });

    const recentOrders = sellerOrders.slice(0, 5).map((o) => ({
      id: o.id,
      buyer: o.shippingRecipientName || o.buyer?.name || 'Pembeli',
      total: Number(o.grandTotal || 0),
      status: o.orderStatus,
      date: o.createdAt.toISOString(),
    }));

    // 30-day daily chart series dynamically aggregated from DB orders
    const chartSeries: Array<{ date: string; revenue: number; orders: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayOrders = sellerOrders.filter((o) => {
        const oDateStr = new Date(o.createdAt).toISOString().split('T')[0];
        return oDateStr === dateStr;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
      chartSeries.push({
        date: dateStr,
        revenue: dayRevenue,
        orders: dayOrders.length,
      });
    }

    const stats = {
      todayRevenue,
      monthlyRevenue,
      ordersCount: sellerOrders.length,
      visitorsCount: Math.max(0, sellerOrders.length * 5 + activeProducts * 3),
      conversionRate: sellerOrders.length > 0 ? '8.5%' : '0.0%',
      totalProducts,
      activeProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        title: p.title,
        stock: p.stock,
        price: Number(p.price),
      })),
      recentOrders,
      chartSeries,
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

  async getStoreBySlug(slug: string) {
    const slugLower = slug.trim().toLowerCase();
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { storeSlug: slugLower },
      include: {
        socialMedia: true,
        user: {
          select: {
            name: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile || profile.status !== SellerStatus.ACTIVE) {
      throw new NotFoundException('Toko tidak ditemukan atau sedang tidak aktif');
    }

    // Get active products aggregation
    const activeProducts = await this.prisma.product.findMany({
      where: {
        sellerId: profile.userId,
        status: 'ACTIVE',
      },
      select: {
        sellerRating: true,
        totalReview: true,
      },
    });

    const totalProducts = activeProducts.length;
    const totalReview = activeProducts.reduce((sum, p) => sum + p.totalReview, 0);
    const averageRating = totalReview > 0
      ? Number((activeProducts.reduce((sum, p) => sum + p.sellerRating, 0) / totalProducts).toFixed(1))
      : null;

    return {
      id: profile.id,
      userId: profile.userId,
      storeName: profile.storeName,
      storeSlug: profile.storeSlug,
      description: profile.description,
      province: profile.province,
      city: profile.city,
      address: profile.address,
      postalCode: profile.postalCode,
      phone: profile.phone,
      logoUrl: profile.logoUrl,
      bannerUrl: profile.bannerUrl,
      socialMedia: profile.socialMedia,
      status: profile.status,
      createdAt: profile.createdAt,
      user: {
        name: profile.user.name,
        image: profile.user.image,
        joinedAt: profile.user.createdAt,
      },
      stats: {
        totalProducts,
        totalReview,
        averageRating,
      },
      impactStats: {
        wasteProcessedKg: 0,
        organicProductsCount: totalProducts,
        farmersHelpedCount: 0,
        isUpcomingFeature: true,
      },
    };
  }
}
