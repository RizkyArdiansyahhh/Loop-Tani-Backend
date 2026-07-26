import { ApiProperty } from '@nestjs/swagger';

export class CheckoutPricingResponseDto {
  @ApiProperty({ example: 100000, description: 'Subtotal harga barang' })
  subtotal: number;

  @ApiProperty({ example: 0, description: 'Total ongkos kirim' })
  shippingCost: number;

  @ApiProperty({ example: 0, description: 'Biaya layanan platform' })
  serviceFee: number;

  @ApiProperty({ example: 0, description: 'Potongan diskon/voucher' })
  discount: number;

  @ApiProperty({ example: 0, description: 'Biaya asuransi pengiriman' })
  insuranceFee: number;

  @ApiProperty({ example: 0, description: 'Biaya aplikasi' })
  applicationFee: number;

  @ApiProperty({ example: 100000, description: 'Total akhir pembayaran' })
  total: number;
}
