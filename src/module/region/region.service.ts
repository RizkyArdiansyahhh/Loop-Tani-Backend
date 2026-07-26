import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { ProvinceResponseDto } from './response/province-response.dto';
import { RegencyResponseDto } from './response/regency-response.dto';
import { DistrictResponseDto } from './response/district-response.dto';
import { VillageResponseDto } from './response/village-response.dto';
import { RegionSearchItemDto, RegionType } from './response/region-search-response.dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all provinces ordered by name ASC
   */
  async getProvinces(): Promise<ProvinceResponseDto[]> {
    return this.prisma.province.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get all regencies by provinceId ordered by name ASC
   */
  async getRegencies(provinceId: string): Promise<RegencyResponseDto[]> {
    return this.prisma.regency.findMany({
      where: {
        provinceId,
      },
      select: {
        id: true,
        provinceId: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get all districts by regencyId ordered by name ASC
   */
  async getDistricts(regencyId: string): Promise<DistrictResponseDto[]> {
    return this.prisma.district.findMany({
      where: {
        regencyId,
      },
      select: {
        id: true,
        regencyId: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get all villages by districtId ordered by name ASC
   */
  async getVillages(districtId: string): Promise<VillageResponseDto[]> {
    return this.prisma.village.findMany({
      where: {
        districtId,
      },
      select: {
        id: true,
        districtId: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Search regions by keyword (min 3 chars), returns up to 20 results
   */
  async searchRegions(keyword: string): Promise<RegionSearchItemDto[]> {
    if (!keyword || keyword.trim().length < 3) {
      return [];
    }

    const term = keyword.trim();
    const results: RegionSearchItemDto[] = [];
    const LIMIT = 20;

    // 1. Search Provinces
    const provinces = await this.prisma.province.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: { id: true, name: true },
      take: LIMIT,
      orderBy: { name: 'asc' },
    });

    for (const prov of provinces) {
      results.push({
        id: prov.id,
        name: prov.name,
        type: RegionType.PROVINCE,
        fullName: prov.name,
      });
    }

    if (results.length >= LIMIT) {
      return results.slice(0, LIMIT);
    }

    // 2. Search Regencies
    const remainingAfterProv = LIMIT - results.length;
    const regencies = await this.prisma.regency.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        province: {
          select: { name: true },
        },
      },
      take: remainingAfterProv,
      orderBy: { name: 'asc' },
    });

    for (const reg of regencies) {
      results.push({
        id: reg.id,
        name: reg.name,
        type: RegionType.REGENCY,
        fullName: `${reg.name}, ${reg.province.name}`,
      });
    }

    if (results.length >= LIMIT) {
      return results.slice(0, LIMIT);
    }

    // 3. Search Districts
    const remainingAfterReg = LIMIT - results.length;
    const districts = await this.prisma.district.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        regency: {
          select: {
            name: true,
            province: {
              select: { name: true },
            },
          },
        },
      },
      take: remainingAfterReg,
      orderBy: { name: 'asc' },
    });

    for (const dist of districts) {
      results.push({
        id: dist.id,
        name: dist.name,
        type: RegionType.DISTRICT,
        fullName: `Kec. ${dist.name}, ${dist.regency.name}, ${dist.regency.province.name}`,
      });
    }

    if (results.length >= LIMIT) {
      return results.slice(0, LIMIT);
    }

    // 4. Search Villages
    const remainingAfterDist = LIMIT - results.length;
    const villages = await this.prisma.village.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        district: {
          select: {
            name: true,
            regency: {
              select: {
                name: true,
                province: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      take: remainingAfterDist,
      orderBy: { name: 'asc' },
    });

    for (const vil of villages) {
      results.push({
        id: vil.id,
        name: vil.name,
        type: RegionType.VILLAGE,
        fullName: `${vil.name}, Kec. ${vil.district.name}, ${vil.district.regency.name}, ${vil.district.regency.province.name}`,
      });
    }

    return results.slice(0, LIMIT);
  }
}
