import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class BuyNowCheckoutDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID produk yang akan dibeli langsung',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'ID produk harus berformat UUID v4 yang valid' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'Jumlah kuantitas produk yang dibeli',
    default: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Kuantitas harus berupa angka bulat' })
  @Min(1, { message: 'Kuantitas minimal 1' })
  quantity: number;

  @ApiPropertyOptional({
    example: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c',
    description: 'ID alamat pengiriman terpilih (opsional, jika kosong akan menggunakan alamat default user)',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'ID alamat harus berformat UUID v4 yang valid' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  addressId?: string;
}
