import { ApiProperty } from '@nestjs/swagger';
import { CheckoutItemResponseDto } from './checkout-item-response.dto';

export class CheckoutStoreResponseDto {
  @ApiProperty({ example: 'seller-id-123', description: 'ID Penjual / Toko' })
  sellerId: string;

  @ApiProperty({ example: 'Toko Tani Subur', description: 'Nama Toko Penjual' })
  sellerName: string;

  @ApiProperty({ example: 'toko-tani-subur', description: 'Slug Toko Penjual' })
  storeSlug: string;

  @ApiProperty({ type: [CheckoutItemResponseDto], description: 'Daftar produk yang dibeli dari toko ini' })
  items: CheckoutItemResponseDto[];

  @ApiProperty({ example: 100000, description: 'Subtotal harga barang dari toko ini' })
  storeSubtotal: number;

  @ApiProperty({ example: 2000, description: 'Total berat barang dari toko ini dalam gram' })
  storeWeight: number;
}
