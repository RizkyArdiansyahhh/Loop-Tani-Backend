import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Session, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@ApiTags('Products')
@ApiCookieAuth('better-auth.session_token')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * POST /products
   */
  @Post()
  @ApiOperation({
    summary: 'Buat produk baru',
    description: 'Membuat produk baru. Memerlukan autentikasi sebagai seller.',
  })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  create(
    @Session() session: UserSession,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(session.user.id, createProductDto);
  }

  /**
   * GET /products
   */
  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar produk (marketplace)',
    description: 'Mengambil daftar produk aktif dengan dukungan pagination, pencarian, filter, dan sorting. Endpoint publik.',
  })
  @ApiResponse({ status: 200, description: 'Daftar produk' })
  findAll(
    @Session() session: UserSession | undefined,
    @Query() getProductsDto: GetProductsDto,
  ) {
    return this.productService.findAll(getProductsDto, session?.user?.id);
  }

  /**
   * GET /products/favorites
   * NOTE: This must be defined BEFORE GET /products/:id to avoid router conflicts
   */
  @Get('favorites')
  @ApiOperation({
    summary: 'Daftar produk yang disukai user',
    description: 'Mengambil daftar produk yang telah ditandai sebagai favorit oleh user yang sedang login.',
  })
  @ApiResponse({ status: 200, description: 'Daftar produk favorit' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getFavorites(
    @Session() session: UserSession,
    @Query() getProductsDto: GetProductsDto,
  ) {
    return this.productService.findAll(
      { ...getProductsDto, favoriteOnly: true },
      session.user.id,
    );
  }

  /**
   * GET /products/:id
   */
  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Detail produk',
    description: 'Mengambil detail lengkap satu produk. Endpoint publik.',
  })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Detail produk ditemukan' })
  @ApiNotFoundResponse({ description: 'Produk tidak ditemukan' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession | undefined,
  ) {
    return this.productService.findOne(id, session?.user?.id);
  }

  /**
   * POST /products/:id/favorite
   */
  @Post(':id/favorite')
  @ApiOperation({
    summary: 'Menyukai produk',
    description: 'Menambahkan produk ke dalam daftar favorit user.',
  })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Produk berhasil difavoritkan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  favorite(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.productService.favorite(id, session.user.id);
  }

  /**
   * DELETE /products/:id/favorite
   */
  @Delete(':id/favorite')
  @ApiOperation({
    summary: 'Batal menyukai produk',
    description: 'Menghapus produk dari daftar favorit user.',
  })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Produk berhasil dihapus dari favorit' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  unfavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.productService.unfavorite(id, session.user.id);
  }

  /**
   * PATCH /products/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update produk',
    description: 'Memperbarui data produk. Hanya seller pemilik produk yang dapat mengupdate.',
  })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Produk berhasil diupdate' })
  @ApiNotFoundResponse({ description: 'Produk tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Bukan pemilik produk' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, session.user.id, updateProductDto);
  }

  /**
   * DELETE /products/:id
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Hapus produk',
    description: 'Menghapus produk secara permanen. Hanya seller pemilik produk yang dapat menghapus.',
  })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Produk berhasil dihapus' })
  @ApiNotFoundResponse({ description: 'Produk tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Bukan pemilik produk' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.productService.remove(id, session.user.id);
  }
}
