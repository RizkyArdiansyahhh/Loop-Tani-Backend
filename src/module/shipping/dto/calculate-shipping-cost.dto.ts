import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCourier } from './shipping-courier.enum';

export class CalculateShippingCostDto {
  @ApiProperty({
    example: 153,
    description: 'ID lokasi/kota/subdistrict asal pengirim',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  originId: number;

  @ApiProperty({
    example: 54,
    description: 'ID lokasi/kota/subdistrict tujuan penerima',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  destinationId: number;

  @ApiProperty({
    example: 1200,
    description: 'Total berat barang dalam gram (integer > 0)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    enum: ShippingCourier,
    example: ShippingCourier.JNE,
    description: 'Kode ekspedisi pengiriman',
  })
  @IsEnum(ShippingCourier)
  @IsNotEmpty()
  courier: ShippingCourier;
}
