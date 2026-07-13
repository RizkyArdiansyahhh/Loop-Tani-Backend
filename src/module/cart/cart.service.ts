import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // GET CART
  // ─────────────────────────────────────────────
  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' } },
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        cart: null,
        items: [],
        summary: {
          totalItems: 0,
          subtotal: 0,
          totalWeight: 0,
        },
      };
    }

    let totalItems = 0;
    let subtotal = 0;
    let totalWeight = 0;

    const mappedItems = cart.items.map((item) => {
      const { product } = item;
      const isAvailable = product.status === 'ACTIVE' && product.stock > 0;
      
      let availabilityReason: 'OUT_OF_STOCK' | 'ARCHIVED' | 'SOLD' | 'DRAFT' | null = null;
      if (!isAvailable) {
        if (product.status === 'DRAFT') {
          availabilityReason = 'DRAFT';
        } else if (product.status === 'SOLD') {
          availabilityReason = 'SOLD';
        } else if (product.status === 'ARCHIVED') {
          availabilityReason = 'ARCHIVED';
        } else if (product.stock === 0) {
          availabilityReason = 'OUT_OF_STOCK';
        }
      }

      const itemSubtotal = isAvailable ? item.quantity * product.price : 0;

      if (isAvailable) {
        totalItems += item.quantity;
        subtotal += itemSubtotal;
        totalWeight += item.quantity * product.weight;
      }

      return {
        id: item.id,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        isAvailable,
        availabilityReason,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          id: product.id,
          title: product.title,
          thumbnail: product.images?.[0]?.imageUrl || null,
          price: product.price,
          stock: product.stock,
          weight: product.weight,
          seller: product.seller,
        },
      };
    });

    return {
      cart: {
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
      items: mappedItems,
      summary: {
        totalItems,
        subtotal,
        totalWeight,
      },
    };
  }

  // ─────────────────────────────────────────────
  // ADD TO CART (Atomic Transaction)
  // ─────────────────────────────────────────────
  async addToCart(userId: string, dto: AddToCartDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find Product
      const product = await tx.product.findUnique({
        where: { id: dto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      // 2. Validate Ownership
      if (product.sellerId === userId) {
        throw new BadRequestException('You cannot add your own product to the cart.');
      }

      // 3. Validate Status
      if (product.status !== 'ACTIVE') {
        throw new BadRequestException(
          `Product status is ${product.status}. Only ACTIVE products can be added to the cart.`
        );
      }

      // 4. Validate Stock
      if (product.stock === 0) {
        throw new ConflictException('Product is out of stock.');
      }

      // 5. Find or Create Cart
      let cart = await tx.cart.findUnique({
        where: { userId },
      });
      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      // 6. Find existing CartItem
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: dto.productId,
          },
        },
      });

      // 7. Calculate target quantity
      const targetQuantity = existingItem
        ? existingItem.quantity + dto.quantity
        : dto.quantity;

      // 8. Validate quantity limits
      if (targetQuantity > product.stock) {
        throw new BadRequestException('Requested quantity exceeds available stock.');
      }

      if (targetQuantity > 999) {
        throw new BadRequestException('Quantity exceeds maximum limit of 999.');
      }

      // 9. Create or Update CartItem
      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: targetQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: dto.productId,
            quantity: targetQuantity,
          },
        });
      }

      // 10. Touch parent Cart updatedAt
      await tx.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });

      return { message: 'Product added to cart successfully.' };
    });
  }

  // ─────────────────────────────────────────────
  // UPDATE ITEM QUANTITY
  // ─────────────────────────────────────────────
  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find CartItem
      const item = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
          product: true,
        },
      });

      if (!item) {
        throw new NotFoundException('Cart item not found.');
      }

      // 2. Validate Ownership
      if (item.cart.userId !== userId) {
        throw new ForbiddenException('You do not own this cart item.');
      }

      // 3. Validate Stock
      if (dto.quantity > item.product.stock) {
        throw new BadRequestException('Requested quantity exceeds available stock.');
      }

      // 4. Update quantity
      await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      });

      // 5. Touch parent Cart
      await tx.cart.update({
        where: { id: item.cartId },
        data: { updatedAt: new Date() },
      });

      return { message: 'Cart item quantity updated successfully.' };
    });
  }

  // ─────────────────────────────────────────────
  // REMOVE ITEM
  // ─────────────────────────────────────────────
  async removeItem(userId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find CartItem
      const item = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: { cart: true },
      });

      if (!item) {
        throw new NotFoundException('Cart item not found.');
      }

      // 2. Validate Ownership
      if (item.cart.userId !== userId) {
        throw new ForbiddenException('You do not own this cart item.');
      }

      // 3. Delete item
      await tx.cartItem.delete({
        where: { id: itemId },
      });

      // 4. Touch parent Cart
      await tx.cart.update({
        where: { id: item.cartId },
        data: { updatedAt: new Date() },
      });

      return { message: 'Item removed from cart successfully.' };
    });
  }

  // ─────────────────────────────────────────────
  // CLEAR CART
  // ─────────────────────────────────────────────
  async clearCart(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find Cart
      const cart = await tx.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        return { message: 'Cart is already empty.' };
      }

      // 2. Delete all items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // 3. Touch parent Cart
      await tx.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });

      return { message: 'Cart cleared successfully.' };
    });
  }
}
