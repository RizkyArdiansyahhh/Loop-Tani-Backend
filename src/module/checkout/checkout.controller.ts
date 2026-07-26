import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CheckoutService } from './checkout.service';
import { BuyNowCheckoutDto } from './dto/buy-now-checkout.dto';
import { CartCheckoutDto } from './dto/cart-checkout.dto';
import { CheckoutResponseDto } from './response/checkout-response.dto';

@ApiTags('Checkout')
@ApiCookieAuth('better-auth.session_token')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('buy-now')
  @ApiOperation({
    summary: 'Preview checkout Beli Sekarang',
    description:
      'Menghasilkan kalkulasi preview ringkasan checkout untuk pembelian langsung 1 produk tanpa membuat pesanan (stateless).',
  })
  @ApiOkResponse({
    description: 'Preview checkout berhasil dihasilkan',
    type: CheckoutResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Produk sendiri, stok tidak mencukupi, atau produk tidak aktif',
  })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Produk atau alamat tidak ditemukan' })
  checkoutBuyNow(
    @Session() session: UserSession,
    @Body() dto: BuyNowCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.checkoutBuyNow(session.user.id, dto);
  }

  @Post('cart')
  @ApiOperation({
    summary: 'Preview checkout dari Keranjang Belanja',
    description:
      'Menghasilkan kalkulasi preview ringkasan checkout untuk daftar item pilihan dari keranjang belanja (stateless).',
  })
  @ApiOkResponse({
    description: 'Preview checkout berhasil dihasilkan',
    type: CheckoutResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Keranjang kosong, item tidak valid, stok tidak mencukupi, atau produk sendiri',
  })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Alamat pengiriman tidak ditemukan' })
  checkoutCart(
    @Session() session: UserSession,
    @Body() dto: CartCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.checkoutCart(session.user.id, dto);
  }
}
