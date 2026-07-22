import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto, ProductSortBy } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  async create(sellerId: string, dto: CreateProductDto) {
    await this.assertActiveSeller(sellerId);
    const slug = await this.generateUniqueSlug(dto.title);

    const product = await this.prisma.product.create({
      data: {
        sellerId,
        category: dto.category,
        title: dto.title,
        slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        condition: dto.condition,
        status: dto.status,
        isFeatured: dto.isFeatured ?? false,
        province: dto.province,
        city: dto.city,
        images: dto.images?.length
          ? {
              createMany: {
                data: dto.images.map((img) => ({
                  imageUrl: img.imageUrl,
                  order: img.order,
                })),
              },
            }
          : undefined,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            sellerProfile: {
              select: { storeSlug: true },
            },
          },
        },
        _count: { select: { favorites: true } },
      },
    });

    return this.serializeProduct(product);
  }

  // ─────────────────────────────────────────────
  // FIND ALL (with pagination, search, sort, and filters)
  // ─────────────────────────────────────────────

  async findAll(dto: GetProductsDto, userId?: string) {
    const {
      page,
      limit,
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      province,
      city,
      minSellerRating,
      favoriteOnly,
      sellerId,
      storeSlug,
    } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
      ...(category && { category }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
      ...(province && {
        province: { contains: province, mode: 'insensitive' },
      }),
      ...(city && {
        city: { contains: city, mode: 'insensitive' },
      }),
      ...(minSellerRating !== undefined && {
        sellerRating: { gte: minSellerRating },
      }),
      ...(favoriteOnly && userId && {
        favorites: {
          some: { userId },
        },
      }),
      ...(sellerId && { sellerId }),
      ...(storeSlug && {
        seller: {
          sellerProfile: {
            storeSlug,
          },
        },
      }),
    };

    const orderBy = this.buildOrderBy(sort);

    const include: Prisma.ProductInclude = {
      images: {
        orderBy: { order: 'asc' },
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          sellerProfile: {
            select: { storeSlug: true },
          },
        },
      },
      _count: { select: { favorites: true } },
    };

    if (userId) {
      include.favorites = { where: { userId } };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: data.map((product) => this.serializeProduct(product, userId)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────

  async findOne(id: string, userId?: string) {
    const include: Prisma.ProductInclude = {
      images: { orderBy: { order: 'asc' } },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          sellerProfile: {
            select: { storeSlug: true },
          },
        },
      },
      _count: { select: { favorites: true } },
    };

    if (userId) {
      include.favorites = { where: { userId } };
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include,
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return this.serializeProduct(product, userId);
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    await this.assertActiveSeller(sellerId);
    await this.assertOwnership(id, sellerId);

    // Regenerate slug only if title changes
    const slug =
      dto.title !== undefined
        ? await this.generateUniqueSlug(dto.title, id)
        : undefined;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.category && { category: dto.category }),
        ...(dto.title && { title: dto.title }),
        ...(slug && { slug }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.condition && { condition: dto.condition }),
        ...(dto.status && { status: dto.status }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.province !== undefined && { province: dto.province }),
        ...(dto.city !== undefined && { city: dto.city }),
        // Sync images: replace all if provided
        ...(dto.images !== undefined && {
          images: {
            deleteMany: {},
            createMany: {
              data: dto.images.map((img) => ({
                imageUrl: img.imageUrl,
                order: img.order,
              })),
            },
          },
        }),
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        seller: { select: { id: true, name: true, image: true } },
        _count: { select: { favorites: true } },
      },
    });

    return this.serializeProduct(product, sellerId);
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  async remove(id: string, sellerId: string) {
    await this.assertActiveSeller(sellerId);
    await this.assertOwnership(id, sellerId);

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // FAVORITE / UNFAVORITE
  // ─────────────────────────────────────────────

  async favorite(productId: string, userId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    try {
      await this.prisma.productFavorite.create({
        data: {
          productId,
          userId,
        },
      });
    } catch (e) {
      // Already favorited, ignore error and return success
    }

    return { message: 'Product favorited successfully' };
  }

  async unfavorite(productId: string, userId: string) {
    try {
      await this.prisma.productFavorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    } catch (e) {
      // Not favorited or already deleted, ignore error
    }

    return { message: 'Product unfavorited successfully' };
  }

  // ─────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────

  private serializeProduct(product: any, userId?: string) {
    const isFavorite = userId
      ? Boolean(product.favorites && product.favorites.length > 0)
      : false;
    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      condition: product.condition,
      status: product.status,
      weight: product.weight,
      isFeatured: product.isFeatured,
      category: product.category,
      thumbnail: product.images?.[0]?.imageUrl || null,
      images: product.images || [],
      seller: {
        id: product.seller.id,
        name: product.seller.name,
        image: product.seller.image,
        storeSlug: product.seller.sellerProfile?.storeSlug || null,
      },
      sellerRating: product.sellerRating,
      totalReview: product.totalReview,
      location:
        product.city && product.province
          ? `${product.city}, ${product.province}`
          : product.province || product.city || null,
      favoriteCount: product._count?.favorites ?? 0,
      isFavorite,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private async assertOwnership(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this product');
    }
  }

  private async assertActiveSeller(sellerId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId: sellerId },
    });

    if (!profile || profile.status !== 'ACTIVE') {
      throw new ForbiddenException('Only active sellers may perform this operation.');
    }
  }

  private buildOrderBy(sort: ProductSortBy): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSortBy.NEWEST:
        return [{ createdAt: 'desc' }];
      case ProductSortBy.OLDEST:
        return [{ createdAt: 'asc' }];
      case ProductSortBy.PRICE_ASC:
        return [{ price: 'asc' }];
      case ProductSortBy.PRICE_DESC:
        return [{ price: 'desc' }];
      case ProductSortBy.RECOMMENDED:
      default:
        return [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    }
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const existing = await this.prisma.product.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
        select: { id: true },
      });

      if (!existing) break;

      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }
}
