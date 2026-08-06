import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCourier } from './shipping-courier.enum';

export class ShippingOptionsRequestDto {
  @ApiPropertyOptional({
    example: 153,
    default: 153,
    description: 'ID lokasi/kota asal pengirim (default: kota toko/gudang)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  originId?: number;

  @ApiProperty({
    example: 54,
    description: 'ID lokasi/subdistrict/kota tujuan pembeli',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  destinationId: number;

  @ApiPropertyOptional({
    example: 1200,
    default: 1000,
    description: 'Total berat barang dalam gram (integer > 0)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    enum: ShippingCourier,
    isArray: true,
    example: [ShippingCourier.JNE, ShippingCourier.SICEPAT, ShippingCourier.JNT],
    description: 'Daftar kurir ekspedisi yang ingin diperiksa',
  })
  @IsArray()
  @IsEnum(ShippingCourier, { each: true })
  @IsOptional()
  couriers?: ShippingCourier[];
}
