import { ApiProperty } from '@nestjs/swagger';
import { CheckoutAddressResponseDto } from './checkout-address-response.dto';
import { CheckoutStoreResponseDto } from './checkout-store-response.dto';
import { CheckoutShippingResponseDto } from './checkout-shipping-response.dto';
import { CheckoutPricingResponseDto } from './checkout-pricing-response.dto';

export class CheckoutResponseDto {
  @ApiProperty({ type: CheckoutAddressResponseDto, nullable: true, description: 'Alamat pengiriman terpilih' })
  address: CheckoutAddressResponseDto | null;

  @ApiProperty({ type: [CheckoutStoreResponseDto], description: 'Daftar toko dan barang yang dibeli (dikelompokkan per toko)' })
  stores: CheckoutStoreResponseDto[];

  @ApiProperty({ type: CheckoutShippingResponseDto, description: 'Informasi opsi pengiriman' })
  shipping: CheckoutShippingResponseDto;

  @ApiProperty({ type: CheckoutPricingResponseDto, description: 'Rincian kalkulasi harga dan total biaya' })
  pricing: CheckoutPricingResponseDto;
}
