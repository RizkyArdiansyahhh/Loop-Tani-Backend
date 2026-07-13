import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    throw new ForbiddenException('Kategori bersifat statis dan tidak dapat ditambah.');
  }

  async findAll() {
    const groups = await this.prisma.product.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { _all: true },
    });

    const countMap = groups.reduce((acc, curr) => {
      // Map database mapped values back (prisma maps enum using the string mappings)
      acc[curr.category] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        id: 'agricultural-waste',
        name: 'Limbah Pertanian',
        slug: 'agricultural-waste',
        _count: { products: countMap['AGRICULTURAL_WASTE'] || countMap['agricultural-waste'] || 0 },
      },
      {
        id: 'processed-product',
        name: 'Produk Olahan',
        slug: 'processed-product',
        _count: { products: countMap['PROCESSED_PRODUCT'] || countMap['processed-product'] || 0 },
      },
      {
        id: 'secondhand',
        name: 'Alat Secondhand',
        slug: 'secondhand',
        _count: { products: countMap['SECONDHAND'] || countMap['secondhand'] || 0 },
      },
    ];
  }

  async findOne(id: string) {
    const nameMap = {
      'agricultural-waste': 'Limbah Pertanian',
      'processed-product': 'Produk Olahan',
      'secondhand': 'Alat Secondhand',
    };

    if (id in nameMap) {
      return {
        id,
        name: nameMap[id as keyof typeof nameMap],
        slug: id,
      };
    }

    throw new NotFoundException(`Category with id "${id}" not found`);
  }
}
