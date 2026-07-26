import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CartCheckoutDto {
  @ApiProperty({
    example: ['item-uuid-1', 'item-uuid-2'],
    description: 'Daftar ID item keranjang belanja yang diproses checkout',
  })
  @IsArray({ message: 'cartItemIds harus berupa array' })
  @ArrayMinSize(1, { message: 'Pilih minimal 1 item keranjang untuk checkout' })
  @IsString({ each: true, message: 'Setiap ID item keranjang harus berupa string' })
  @IsUUID('4', { each: true, message: 'Setiap ID item keranjang harus berupa UUID v4 yang valid' })
  cartItemIds: string[];

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
