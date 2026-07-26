import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateOrderDto, CheckoutType } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { CreateOrderResponseDto } from './response/create-order-response.dto';
import { OrderResponseDto } from './response/order-response.dto';
import { OrderPaginatedResponseDto } from './response/order-paginated-response.dto';
import { Prisma, ProductStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Collision-proof Order Number Generator (LT-YYYYMMDD-XXXXXX)
   */
  private async generateOrderNumber(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    let attempts = 0;
    while (attempts < 10) {
      attempts++;
      const randomHex = Math.random()
        .toString(16)
        .substring(2, 8)
        .toUpperCase();
      const candidate = `LT-${dateStr}-${randomHex}`;

      const existing = await tx.order.findUnique({
        where: { orderNumber: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    throw new InternalServerErrorException(
      'Gagal membuat nomor order unik. Silakan coba lagi.',
    );
  }

  /**
   * Auto Check & Expire Pending Orders whose expiredAt timer has passed.
   * Restores product stock automatically upon expiration!
   */
  private async checkAndExpirePendingOrders(userId?: string): Promise<void> {
    const now = new Date();

    // Find all PENDING_PAYMENT orders that have passed expiredAt
    const expiredOrders = await this.prisma.order.findMany({
      where: {
        ...(userId ? { buyerId: userId } : {}),
        orderStatus: OrderStatus.PENDING_PAYMENT,
        expiredAt: {
          lte: now,
        },
      },
      include: {
        items: true,
      },
    });

    for (const order of expiredOrders) {
      await this.prisma.$transaction(async (tx) => {
        // Double check status inside transaction
        const currentOrder = await tx.order.findUnique({
          where: { id: order.id },
          select: { orderStatus: true },
        });

        if (currentOrder?.orderStatus !== OrderStatus.PENDING_PAYMENT) {
          return;
        }

        // Update status to EXPIRED
        await tx.order.update({
          where: { id: order.id },
          data: { orderStatus: OrderStatus.EXPIRED },
        });

        // Restore product stock
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      });
    }
  }

  /**
   * Helper Mapper to transform Prisma Order entity into OrderResponseDto
   */
  private mapToOrderResponseDto(order: any): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      buyerId: order.buyerId,
      seller: {
        sellerId: order.sellerId,
        storeName: order.sellerStoreName,
        storeSlug: order.sellerStoreSlug,
        logoUrl: order.sellerLogo,
      },
      shippingAddress: {
        recipientName: order.shippingRecipientName,
        recipientPhone: order.shippingRecipientPhone,
        provinceId: order.shippingProvinceId,
        provinceName: order.shippingProvinceName,
        cityId: order.shippingCityId,
        cityName: order.shippingCityName,
        districtId: order.shippingDistrictId,
        districtName: order.shippingDistrictName,
        subDistrictId: order.shippingSubDistrictId,
        subDistrictName: order.shippingSubDistrictName,
        postalCode: order.shippingPostalCode,
        street: order.shippingStreet,
        notes: order.shippingNotes,
      },
      pricing: {
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        serviceFee: Number(order.serviceFee),
        discount: Number(order.discount),
        insuranceFee: Number(order.insuranceFee),
        applicationFee: Number(order.applicationFee),
        grandTotal: Number(order.grandTotal),
        totalWeight: order.totalWeight,
      },
      orderStatus: order.orderStatus,
      expiredAt: order.expiredAt ? order.expiredAt.toISOString() : null,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        thumbnailUrl: item.thumbnailUrl,
        productPrice: Number(item.productPrice),
        weight: item.weight,
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        unit: item.unit,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  /**
   * Unified Entrypoint: Create Order from Buy Now or Cart
   */
  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    // 1. Fetch Address Snapshot Data
    const address = await this.prisma.address.findFirst({
      where: {
        id: dto.addressId,
        userId,
        deletedAt: null,
      },
    });

    if (!address) {
      throw new NotFoundException(
        'Alamat pengiriman tidak ditemukan atau tidak aktif',
      );
    }

    if (dto.checkoutType === CheckoutType.BUY_NOW) {
      return this.handleBuyNowOrder(userId, dto, address);
    } else {
      return this.handleCartOrder(userId, dto, address);
    }
  }

  /**
   * Handle Single Product Buy Now Order
   */
  private async handleBuyNowOrder(
    userId: string,
    dto: CreateOrderDto,
    address: any,
  ): Promise<CreateOrderResponseDto> {
    if (!dto.productId) {
      throw new BadRequestException(
        'productId wajib diisi untuk checkout BUY_NOW',
      );
    }
    const quantity = dto.quantity || 1;

    // Fetch product with seller profile
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: {
        seller: {
          include: {
            sellerProfile: true,
          },
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new BadRequestException('Produk tidak ditemukan atau tidak aktif');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stok produk "${product.title}" tidak mencukupi (tersedia: ${product.stock})`,
      );
    }

    const priceNumber = Number(product.price);
    const subtotalNumber = priceNumber * quantity;
    const totalWeight = (product.weight || 0) * quantity;
    const thumbnailUrl = product.images?.[0]?.imageUrl || null;

    const storeName =
      product.seller.sellerProfile?.storeName ||
      product.seller.name ||
      'Toko Tani';
    const storeSlug =
      product.seller.sellerProfile?.storeSlug || product.seller.id;
    const sellerLogo =
      product.seller.sellerProfile?.logoUrl || product.seller.image || null;

    // Fixed service fee
    const serviceFee = 1000;
    const grandTotal = subtotalNumber + serviceFee;

    // 24 Hours Payment Expiration Timer
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Atomic Prisma Transaction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      // Re-verify stock inside transaction lock
      const currentProd = await tx.product.findUnique({
        where: { id: product.id },
        select: { stock: true, status: true },
      });

      if (!currentProd || currentProd.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException('Produk tidak lagi aktif');
      }

      if (currentProd.stock < quantity) {
        throw new BadRequestException(
          `Stok produk "${product.title}" telah habis atau tidak mencukupi`,
        );
      }

      const orderNumber = await this.generateOrderNumber(tx);

      // Create Order (PENDING_PAYMENT)
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId: userId,
          sellerId: product.seller.id,

          // Seller Snapshot
          sellerStoreName: storeName,
          sellerStoreSlug: storeSlug,
          sellerLogo,

          // Address Snapshot
          shippingRecipientName: address.recipientName,
          shippingRecipientPhone: address.recipientPhone,
          shippingProvinceId: address.provinceId,
          shippingProvinceName: address.provinceName,
          shippingCityId: address.cityId,
          shippingCityName: address.cityName,
          shippingDistrictId: address.districtId,
          shippingDistrictName: address.districtName,
          shippingSubDistrictId: address.subDistrictId,
          shippingSubDistrictName: address.subDistrictName,
          shippingPostalCode: address.postalCode,
          shippingStreet: address.street,
          shippingNotes: address.notes,

          // Pricing & Weight
          subtotal: new Prisma.Decimal(subtotalNumber),
          shippingCost: new Prisma.Decimal(0),
          serviceFee: new Prisma.Decimal(serviceFee),
          discount: new Prisma.Decimal(0),
          insuranceFee: new Prisma.Decimal(0),
          applicationFee: new Prisma.Decimal(0),
          grandTotal: new Prisma.Decimal(grandTotal),
          totalWeight,

          // Status & 24h Timer
          orderStatus: OrderStatus.PENDING_PAYMENT,
          expiredAt,

          // Items
          items: {
            create: [
              {
                productId: product.id,
                productName: product.title,
                productSlug: product.slug,
                thumbnailUrl,
                productPrice: new Prisma.Decimal(priceNumber),
                weight: product.weight || 0,
                quantity,
                subtotal: new Prisma.Decimal(subtotalNumber),
                categoryId: null,
                categoryName: product.category || null,
                unit: 'unit',
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      // Deduct stock immediately
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: { decrement: quantity },
        },
      });

      return newOrder;
    });

    return {
      orders: [this.mapToOrderResponseDto(createdOrder)],
      totalOrders: 1,
    };
  }

  /**
   * Handle Multi-Item / Multi-Seller Cart Order
   */
  private async handleCartOrder(
    userId: string,
    dto: CreateOrderDto,
    address: any,
  ): Promise<CreateOrderResponseDto> {
    if (!dto.cartItemIds || dto.cartItemIds.length === 0) {
      throw new BadRequestException(
        'cartItemIds wajib diisi dan minimal 1 item untuk checkout CART',
      );
    }

    // Fetch user's cart items
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: { in: dto.cartItemIds },
        cart: { userId },
      },
      include: {
        product: {
          include: {
            seller: {
              include: {
                sellerProfile: true,
              },
            },
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException(
        'Tidak ada item keranjang yang ditemukan untuk diproses',
      );
    }

    // Check availability & stock
    for (const item of cartItems) {
      if (!item.product || item.product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException(
          `Produk "${item.product?.title || 'Item'}" sudah tidak aktif`,
        );
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Stok produk "${item.product.title}" tidak mencukupi (tersedia: ${item.product.stock})`,
        );
      }
    }

    // Group items per seller
    const sellerMap = new Map<string, typeof cartItems>();
    for (const item of cartItems) {
      const sellerId = item.product.seller.id;
      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, []);
      }
      sellerMap.get(sellerId)!.push(item);
    }

    // 24 Hours Payment Expiration Timer
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Execute Prisma Transaction
    const createdOrders = await this.prisma.$transaction(async (tx) => {
      const ordersResult: any[] = [];

      for (const [sellerId, sellerItems] of sellerMap.entries()) {
        const firstSeller = sellerItems[0].product.seller;
        const storeName =
          firstSeller.sellerProfile?.storeName ||
          firstSeller.name ||
          'Toko Tani';
        const storeSlug =
          firstSeller.sellerProfile?.storeSlug || firstSeller.id;
        const sellerLogo =
          firstSeller.sellerProfile?.logoUrl || firstSeller.image || null;

        let storeSubtotal = 0;
        let storeWeight = 0;
        const itemCreates: any[] = [];

        for (const item of sellerItems) {
          // Re-verify stock in transaction
          const currentProd = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true, status: true },
          });

          if (!currentProd || currentProd.status !== ProductStatus.ACTIVE) {
            throw new BadRequestException(
              `Produk "${item.product.title}" tidak lagi aktif`,
            );
          }

          if (currentProd.stock < item.quantity) {
            throw new BadRequestException(
              `Stok produk "${item.product.title}" telah habis atau tidak mencukupi`,
            );
          }

          const priceNumber = Number(item.product.price);
          const itemSubtotal = priceNumber * item.quantity;
          const itemWeight = (item.product.weight || 0) * item.quantity;

          storeSubtotal += itemSubtotal;
          storeWeight += itemWeight;

          itemCreates.push({
            productId: item.product.id,
            productName: item.product.title,
            productSlug: item.product.slug,
            thumbnailUrl: item.product.images?.[0]?.imageUrl || null,
            productPrice: new Prisma.Decimal(priceNumber),
            weight: item.product.weight || 0,
            quantity: item.quantity,
            subtotal: new Prisma.Decimal(itemSubtotal),
            categoryId: null,
            categoryName: item.product.category || null,
            unit: 'unit',
          });

          // Deduct stock immediately
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        const serviceFee = 1000;
        const grandTotal = storeSubtotal + serviceFee;
        const orderNumber = await this.generateOrderNumber(tx);

        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            buyerId: userId,
            sellerId,

            // Seller Snapshot
            sellerStoreName: storeName,
            sellerStoreSlug: storeSlug,
            sellerLogo,

            // Address Snapshot
            shippingRecipientName: address.recipientName,
            shippingRecipientPhone: address.recipientPhone,
            shippingProvinceId: address.provinceId,
            shippingProvinceName: address.provinceName,
            shippingCityId: address.cityId,
            shippingCityName: address.cityName,
            shippingDistrictId: address.districtId,
            shippingDistrictName: address.districtName,
            shippingSubDistrictId: address.subDistrictId,
            shippingSubDistrictName: address.subDistrictName,
            shippingPostalCode: address.postalCode,
            shippingStreet: address.street,
            shippingNotes: address.notes,

            // Pricing & Weight
            subtotal: new Prisma.Decimal(storeSubtotal),
            shippingCost: new Prisma.Decimal(0),
            serviceFee: new Prisma.Decimal(serviceFee),
            discount: new Prisma.Decimal(0),
            insuranceFee: new Prisma.Decimal(0),
            applicationFee: new Prisma.Decimal(0),
            grandTotal: new Prisma.Decimal(grandTotal),
            totalWeight: storeWeight,

            // Status & 24h Timer
            orderStatus: OrderStatus.PENDING_PAYMENT,
            expiredAt,

            items: {
              create: itemCreates,
            },
          },
          include: {
            items: true,
          },
        });

        ordersResult.push(newOrder);
      }

      // Delete purchased cart items
      await tx.cartItem.deleteMany({
        where: {
          id: { in: dto.cartItemIds },
        },
      });

      return ordersResult;
    });

    return {
      orders: createdOrders.map((o) => this.mapToOrderResponseDto(o)),
      totalOrders: createdOrders.length,
    };
  }

  /**
   * Get User Orders List with Pagination & Status Filter
   */
  async getUserOrders(
    userId: string,
    queryDto: GetOrdersQueryDto,
  ): Promise<OrderPaginatedResponseDto> {
    // Lazy check & update expired orders for this user
    await this.checkAndExpirePendingOrders(userId);

    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      buyerId: userId,
      ...(queryDto.status ? { orderStatus: queryDto.status } : {}),
    };

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: orders.map((o) => this.mapToOrderResponseDto(o)),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get Single Order Detail
   */
  async getOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderResponseDto> {
    // Lazy check & update expired orders
    await this.checkAndExpirePendingOrders(userId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (order.buyerId !== userId && order.sellerId !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke pesanan ini',
      );
    }

    return this.mapToOrderResponseDto(order);
  }

  /**
   * Cancel Order manually by Buyer (Restores Stock)
   */
  async cancelOrder(
    userId: string,
    orderId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (order.buyerId !== userId) {
      throw new ForbiddenException(
        'Anda tidak berhak membatalkan pesanan ini',
      );
    }

    if (order.orderStatus !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        'Hanya pesanan yang belum dibayar yang dapat dibatalkan',
      );
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.CANCELLED },
        include: { items: true },
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return cancelled;
    });

    return this.mapToOrderResponseDto(updatedOrder);
  }
}
