import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    throw new ForbiddenException('Kategori bersifat statis di publik. Gunakan panel admin.');
  }

  async findAll() {
    // Fetch only MARKETPLACE categories for marketplace display
    const categories = await this.prisma.category.findMany({
      where: { type: 'MARKETPLACE' },
      orderBy: { name: 'asc' },
    });

    const groups = await this.prisma.product.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { _all: true },
    });

    const countMap = groups.reduce((acc, curr) => {
      acc[curr.category.toLowerCase()] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      _count: {
        products: countMap[cat.slug.toLowerCase()] || 0,
      },
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
    });

    if (!category) {
      throw new NotFoundException(`Kategori dengan id/slug "${id}" tidak ditemukan`);
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }
}
