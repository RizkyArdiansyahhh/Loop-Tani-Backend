import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { SearchDestinationDto } from './dto/search-destination.dto';
import { CalculateShippingCostDto } from './dto/calculate-shipping-cost.dto';
import { ShippingOptionsRequestDto } from './dto/shipping-options-request.dto';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('destination')
  @ApiOperation({
    summary: 'Cari lokasi destinasi pengiriman',
    description:
      'Mencari daftar provinsi, kota/kabupaten, dan kecamatan berdasarkan kata kunci pencarian.',
  })
  @ApiQuery({
    name: 'search',
    required: true,
    description: 'Kata kunci lokasi (misal: Pekanbaru)',
    example: 'Pekanbaru',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar lokasi destinasi berhasil ditemukan.',
    example: [
      {
        id: 153,
        province: 'Riau',
        city: 'Kota Pekanbaru',
        district: 'Pekanbaru Kota',
        subdistrict: 'Pekanbaru Kota',
      },
    ],
  })
  async searchDestination(@Query() query: SearchDestinationDto) {
    return this.shippingService.searchDestination(query.search);
  }

  @Post('options')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dapatkan opsi pengiriman multi-kurir terkelompok (Tokopedia Style)',
    description:
      'Mengambil daftar opsi pengiriman yang dikelompokkan berdasarkan kurir (JNE, SiCepat, J&T, dll) beserta rekomendasi layanan dan harga.',
  })
  @ApiBody({ type: ShippingOptionsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Daftar opsi pengiriman multi-kurir terkelompok berhasil didapatkan.',
    example: [
      {
        courierCode: 'JNE',
        courierName: 'JNE Express',
        services: [
          {
            serviceCode: 'REG',
            serviceName: 'Layanan Reguler',
            etd: '2-3',
            cost: 18000,
            isRecommended: true,
            isCheapest: false,
          },
          {
            serviceCode: 'YES',
            serviceName: 'Yakin Esok Sampai',
            etd: '1',
            cost: 28000,
            isRecommended: false,
            isCheapest: false,
          },
        ],
      },
    ],
  })
  async getShippingOptions(@Body() dto: ShippingOptionsRequestDto) {
    const originId = dto.originId || 153; // Default Pekanbaru store origin
    const weight = dto.weight || 1000;
    const couriers = dto.couriers || ['jne', 'pos', 'tiki', 'sicepat', 'jnt'];

    return this.shippingService.calculateMultiCourierOptions(
      originId,
      dto.destinationId,
      weight,
      couriers,
    );
  }

  @Post('cost')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hitung tarif ongkos kirim (Single Courier)',
    description:
      'Menghitung estimasi tarif dan durasi pengiriman untuk 1 ekspedisi spesifik.',
  })
  @ApiBody({ type: CalculateShippingCostDto })
  @ApiResponse({
    status: 200,
    description: 'Daftar pilihan layanan dan harga ongkir berhasil dihitung.',
  })
  async calculateCost(@Body() dto: CalculateShippingCostDto) {
    return this.shippingService.calculateShippingCost(dto);
  }
}
