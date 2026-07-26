import { ApiProperty } from '@nestjs/swagger';

export class CheckoutItemResponseDto {
  @ApiProperty({ example: 'cart-item-id-123', description: 'ID item (dari CartItem ID atau temp ID jika Buy Now)' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', description: 'ID Produk' })
  productId: string;

  @ApiProperty({ example: 'Pupuk Organik NPK Super 1kg', description: 'Nama Produk' })
  productName: string;

  @ApiProperty({ example: 'pupuk-organik-npk-super-1kg', description: 'Slug Produk' })
  slug: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true, description: 'Gambar utama produk' })
  image: string | null;

  @ApiProperty({ example: 50000, description: 'Harga satuan produk' })
  price: number;

  @ApiProperty({ example: 1000, description: 'Berat satuan produk dalam gram' })
  weight: number;

  @ApiProperty({ example: 2, description: 'Jumlah kuantitas dibeli' })
  quantity: number;

  @ApiProperty({ example: 100000, description: 'Subtotal item (price * quantity)' })
  subtotal: number;

  @ApiProperty({ example: 'seller-id-123', description: 'ID Penjual / Toko' })
  sellerId: string;

  @ApiProperty({ example: 'Toko Tani Subur', description: 'Nama Toko Penjual' })
  sellerName: string;
}
