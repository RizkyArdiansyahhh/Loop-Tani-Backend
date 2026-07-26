import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { BuyNowCheckoutDto } from './dto/buy-now-checkout.dto';
import { CartCheckoutDto } from './dto/cart-checkout.dto';
import { CheckoutResponseDto } from './response/checkout-response.dto';
import { CheckoutAddressResponseDto } from './response/checkout-address-response.dto';
import { CheckoutStoreResponseDto } from './response/checkout-store-response.dto';
import { CheckoutItemResponseDto } from './response/checkout-item-response.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a preview checkout for Buy Now (single product).
   */
  async checkoutBuyNow(
    userId: string,
    dto: BuyNowCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        seller: {
          include: {
            sellerProfile: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    this.validateProductStatus(product.status, product.title);
    this.validateStock(product.stock, dto.quantity, product.title);

    if (product.sellerId === userId) {
      throw new BadRequestException('Anda tidak dapat membeli produk Anda sendiri');
    }

    const address = await this.validateAddress(userId, dto.addressId);

    const storeName =
      product.seller.sellerProfile?.storeName ||
      product.seller.name ||
      'Toko Tani';
    const storeSlug =
      product.seller.sellerProfile?.storeSlug || product.sellerId;

    const itemSubtotal = product.price * dto.quantity;
    const itemWeight = product.weight * dto.quantity;

    const itemResponse: CheckoutItemResponseDto = {
      id: `buy-now-${product.id}`,
      productId: product.id,
      productName: product.title,
      slug: product.slug,
      image: product.images[0]?.imageUrl || null,
      price: product.price,
      weight: product.weight,
      quantity: dto.quantity,
      subtotal: itemSubtotal,
      sellerId: product.sellerId,
      sellerName: storeName,
    };

    const storeResponse: CheckoutStoreResponseDto = {
      sellerId: product.sellerId,
      sellerName: storeName,
      storeSlug: storeSlug,
      items: [itemResponse],
      storeSubtotal: itemSubtotal,
      storeWeight: itemWeight,
    };

    return this.buildCheckoutResponse(address, [storeResponse]);
  }

  /**
   * Generates a preview checkout for selected items in the user's cart.
   */
  async checkoutCart(
    userId: string,
    dto: CartCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new BadRequestException('Keranjang belanja kosong');
    }

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: { in: dto.cartItemIds },
        cartId: cart.id,
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            seller: {
              include: {
                sellerProfile: true,
              },
            },
          },
        },
      },
    });

    if (cartItems.length !== dto.cartItemIds.length) {
      throw new BadRequestException(
        'Satu atau lebih item keranjang tidak ditemukan atau tidak valid',
      );
    }

    // Validate each cart item
    for (const item of cartItems) {
      this.validateProductStatus(item.product.status, item.product.title);
      this.validateStock(item.product.stock, item.quantity, item.product.title);

      if (item.product.sellerId === userId) {
        throw new BadRequestException(
          `Anda tidak dapat membeli produk Anda sendiri (${item.product.title})`,
        );
      }
    }

    const address = await this.validateAddress(userId, dto.addressId);

    // Group items by seller
    const storeMap = new Map<string, CheckoutStoreResponseDto>();

    for (const item of cartItems) {
      const p = item.product;
      const sellerId = p.sellerId;
      const storeName =
        p.seller.sellerProfile?.storeName || p.seller.name || 'Toko Tani';
      const storeSlug = p.seller.sellerProfile?.storeSlug || sellerId;

      const itemSubtotal = p.price * item.quantity;
      const itemWeight = p.weight * item.quantity;

      const itemResponse: CheckoutItemResponseDto = {
        id: item.id,
        productId: p.id,
        productName: p.title,
        slug: p.slug,
        image: p.images[0]?.imageUrl || null,
        price: p.price,
        weight: p.weight,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        sellerId: sellerId,
        sellerName: storeName,
      };

      if (!storeMap.has(sellerId)) {
        storeMap.set(sellerId, {
          sellerId,
          sellerName: storeName,
          storeSlug,
          items: [],
          storeSubtotal: 0,
          storeWeight: 0,
        });
      }

      const storeGroup = storeMap.get(sellerId)!;
      storeGroup.items.push(itemResponse);
      storeGroup.storeSubtotal += itemSubtotal;
      storeGroup.storeWeight += itemWeight;
    }

    const stores = Array.from(storeMap.values());
    return this.buildCheckoutResponse(address, stores);
  }

  /**
   * Validates that the product status is ACTIVE.
   */
  private validateProductStatus(status: ProductStatus, title: string): void {
    if (status !== ProductStatus.ACTIVE) {
      throw new BadRequestException(
        `Produk "${title}" tidak aktif atau tidak dapat dibeli`,
      );
    }
  }

  /**
   * Validates product stock.
   */
  private validateStock(
    currentStock: number,
    requestedQty: number,
    title: string,
  ): void {
    if (currentStock < requestedQty) {
      throw new BadRequestException(
        `Stok produk "${title}" tidak mencukupi (Tersisa ${currentStock})`,
      );
    }
  }

  /**
   * Validates and retrieves the target shipping address for the user.
   * Ensures soft-deleted addresses (deletedAt !== null) are ignored.
   */
  private async validateAddress(
    userId: string,
    addressId?: string,
  ): Promise<CheckoutAddressResponseDto | null> {
    let targetAddress;

    if (addressId) {
      targetAddress = await this.prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
          deletedAt: null,
        },
      });

      if (!targetAddress) {
        throw new NotFoundException(
          'Alamat pengiriman tidak ditemukan atau telah dihapus',
        );
      }
    } else {
      // Find default address first
      targetAddress = await this.prisma.address.findFirst({
        where: {
          userId,
          isDefault: true,
          deletedAt: null,
        },
      });

      // Fallback to most recent non-deleted address
      if (!targetAddress) {
        targetAddress = await this.prisma.address.findFirst({
          where: {
            userId,
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
    }

    if (!targetAddress) {
      return null;
    }

    const fullAddress = `${targetAddress.street}, ${targetAddress.subDistrictName}, ${targetAddress.districtName}, ${targetAddress.cityName}, ${targetAddress.provinceName}, ${targetAddress.postalCode}`;

    return {
      id: targetAddress.id,
      recipientName: targetAddress.recipientName,
      recipientPhone: targetAddress.recipientPhone,
      fullAddress,
      province: targetAddress.provinceName,
      city: targetAddress.cityName,
      district: targetAddress.districtName,
      subDistrict: targetAddress.subDistrictName,
      postalCode: targetAddress.postalCode,
      isDefault: targetAddress.isDefault,
    };
  }

  /**
   * Builds the final clean future-proof checkout response object.
   */
  private buildCheckoutResponse(
    address: CheckoutAddressResponseDto | null,
    stores: CheckoutStoreResponseDto[],
  ): CheckoutResponseDto {
    const subtotal = stores.reduce(
      (sum, store) => sum + store.storeSubtotal,
      0,
    );

    const shippingCost = 0;
    const serviceFee = 0;
    const discount = 0;
    const insuranceFee = 0;
    const applicationFee = 0;

    const total =
      subtotal +
      shippingCost +
      serviceFee +
      insuranceFee +
      applicationFee -
      discount;

    return {
      address,
      stores,
      shipping: {
        courier: null,
        service: null,
        etd: null,
        cost: shippingCost,
      },
      pricing: {
        subtotal,
        shippingCost,
        serviceFee,
        discount,
        insuranceFee,
        applicationFee,
        total,
      },
    };
  }
}
