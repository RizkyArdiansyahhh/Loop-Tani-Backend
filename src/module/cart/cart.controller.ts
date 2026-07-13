import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiCookieAuth('better-auth.session_token')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Ambil isi keranjang belanja',
    description: 'Mengambil daftar produk di keranjang belanja beserta rincian ringkasan subtotal & totalWeight.',
  })
  @ApiOkResponse({ description: 'Isi keranjang belanja berhasil diambil' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getCart(@Session() session: UserSession) {
    return this.cartService.getCart(session.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tambah produk ke keranjang',
    description: 'Menambahkan produk baru atau mengakumulasi kuantitas produk yang sudah ada di keranjang.',
  })
  @ApiOkResponse({ description: 'Produk berhasil ditambahkan ke keranjang' })
  @ApiBadRequestResponse({ description: 'Produk sendiri, status tidak aktif, atau melampaui stok' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Produk tidak ditemukan' })
  @ApiConflictResponse({ description: 'Produk habis (out of stock)' })
  addToCart(
    @Session() session: UserSession,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(session.user.id, addToCartDto);
  }

  @Patch('items/:id')
  @ApiOperation({
    summary: 'Ubah kuantitas item keranjang',
    description: 'Memperbarui kuantitas produk yang ada di dalam keranjang belanja.',
  })
  @ApiOkResponse({ description: 'Kuantitas berhasil diperbarui' })
  @ApiBadRequestResponse({ description: 'Kuantitas melampaui batas stok' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Item keranjang tidak ditemukan' })
  updateItem(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(session.user.id, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: 'Hapus satu item dari keranjang',
    description: 'Menghapus satu item produk dari keranjang belanja secara permanen.',
  })
  @ApiOkResponse({ description: 'Item berhasil dihapus' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Item keranjang tidak ditemukan' })
  removeItem(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.cartService.removeItem(session.user.id, id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Kosongkan isi keranjang',
    description: 'Menghapus seluruh item produk dari keranjang belanja tanpa menghapus data keranjang itu sendiri.',
  })
  @ApiOkResponse({ description: 'Keranjang berhasil dikosongkan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  clearCart(@Session() session: UserSession) {
    return this.cartService.clearCart(session.user.id);
  }
}
