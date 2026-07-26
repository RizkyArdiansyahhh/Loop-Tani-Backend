import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RegionService } from './region.service';
import { GetRegenciesDto } from './dto/get-regencies.dto';
import { GetDistrictsDto } from './dto/get-districts.dto';
import { GetVillagesDto } from './dto/get-villages.dto';
import { SearchRegionDto } from './dto/search-region.dto';
import { ProvinceResponseDto } from './response/province-response.dto';
import { RegencyResponseDto } from './response/regency-response.dto';
import { DistrictResponseDto } from './response/district-response.dto';
import { VillageResponseDto } from './response/village-response.dto';
import { RegionSearchItemDto } from './response/region-search-response.dto';

@ApiTags('Regions')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  /**
   * GET /regions/provinces
   */
  @Get('provinces')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar semua provinsi',
    description:
      'Mengambil daftar seluruh provinsi di Indonesia, diurutkan berdasarkan nama secara ascending. **Endpoint publik.**',
  })
  @ApiOkResponse({
    description: 'Daftar provinsi berhasil diambil',
    type: [ProvinceResponseDto],
  })
  async getProvinces(): Promise<ProvinceResponseDto[]> {
    return this.regionService.getProvinces();
  }

  /**
   * GET /regions/regencies?provinceId=14
   */
  @Get('regencies')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar kabupaten/kota berdasarkan provinceId',
    description:
      'Mengambil daftar kabupaten/kota milik provinsi tertentu. Parameter `provinceId` wajib diisi. **Endpoint publik.**',
  })
  @ApiQuery({
    name: 'provinceId',
    description: 'ID Provinsi (kode Kemendagri)',
    example: '14',
    required: true,
  })
  @ApiOkResponse({
    description: 'Daftar kabupaten/kota berhasil diambil',
    type: [RegencyResponseDto],
  })
  async getRegencies(
    @Query() query: GetRegenciesDto,
  ): Promise<RegencyResponseDto[]> {
    return this.regionService.getRegencies(query.provinceId);
  }

  /**
   * GET /regions/districts?regencyId=1401
   */
  @Get('districts')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar kecamatan berdasarkan regencyId',
    description:
      'Mengambil daftar kecamatan milik kabupaten/kota tertentu. Parameter `regencyId` wajib diisi. **Endpoint publik.**',
  })
  @ApiQuery({
    name: 'regencyId',
    description: 'ID Kabupaten/Kota (kode Kemendagri)',
    example: '1401',
    required: true,
  })
  @ApiOkResponse({
    description: 'Daftar kecamatan berhasil diambil',
    type: [DistrictResponseDto],
  })
  async getDistricts(
    @Query() query: GetDistrictsDto,
  ): Promise<DistrictResponseDto[]> {
    return this.regionService.getDistricts(query.regencyId);
  }

  /**
   * GET /regions/villages?districtId=140101
   */
  @Get('villages')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar kelurahan/desa berdasarkan districtId',
    description:
      'Mengambil daftar kelurahan/desa milik kecamatan tertentu. Parameter `districtId` wajib diisi. **Endpoint publik.**',
  })
  @ApiQuery({
    name: 'districtId',
    description: 'ID Kecamatan (kode Kemendagri)',
    example: '140101',
    required: true,
  })
  @ApiOkResponse({
    description: 'Daftar kelurahan/desa berhasil diambil',
    type: [VillageResponseDto],
  })
  async getVillages(
    @Query() query: GetVillagesDto,
  ): Promise<VillageResponseDto[]> {
    return this.regionService.getVillages(query.districtId);
  }

  /**
   * GET /regions/search?keyword=bandung
   */
  @Get('search')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Pencarian autocomplete wilayah',
    description:
      'Mencari wilayah (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan/Desa) berdasarkan kata kunci nama. Minimal 3 karakter. Maksimal 20 data. **Endpoint publik.**',
  })
  @ApiQuery({
    name: 'keyword',
    description: 'Kata kunci pencarian nama wilayah',
    example: 'bandung',
    required: true,
  })
  @ApiOkResponse({
    description: 'Hasil pencarian wilayah berhasil diambil',
    type: [RegionSearchItemDto],
  })
  async searchRegions(
    @Query() query: SearchRegionDto,
  ): Promise<RegionSearchItemDto[]> {
    return this.regionService.searchRegions(query.keyword);
  }
}
