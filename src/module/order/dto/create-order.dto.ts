import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export enum CheckoutType {
  BUY_NOW = 'BUY_NOW',
  CART = 'CART',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Jenis checkout yang dilakukan',
    enum: CheckoutType,
    example: CheckoutType.BUY_NOW,
  })
  @IsEnum(CheckoutType, {
    message: 'checkoutType harus berupa BUY_NOW atau CART',
  })
  @IsNotEmpty({ message: 'checkoutType tidak boleh kosong' })
  checkoutType: CheckoutType;

  @ApiProperty({
    description: 'ID Alamat Pengiriman',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsUUID('4', { message: 'addressId harus berupa UUID v4 valid' })
  @IsNotEmpty({ message: 'addressId tidak boleh kosong' })
  addressId: string;

  // Fields for BUY_NOW
  @ApiPropertyOptional({
    description: 'ID Produk (Wajib jika checkoutType = BUY_NOW)',
    example: 'p1234567-89ab-cdef-0123-456789abcdef',
  })
  @IsOptional()
  @IsUUID('4', { message: 'productId harus berupa UUID v4 valid' })
  productId?: string;

  @ApiPropertyOptional({
    description: 'Jumlah kuantitas (Wajib jika checkoutType = BUY_NOW)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'quantity harus berupa angka bulat' })
  @Min(1, { message: 'quantity minimal 1' })
  quantity?: number;

  // Fields for CART
  @ApiPropertyOptional({
    description:
      'Daftar ID CartItem yang akan dibeli (Wajib jika checkoutType = CART)',
    example: ['item-uuid-1', 'item-uuid-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'cartItemIds harus berupa array string' })
  @ArrayMinSize(1, { message: 'Pilih minimal 1 item keranjang' })
  @IsString({ each: true, message: 'Setiap cartItemId harus berupa string' })
  cartItemIds?: string[];
}
