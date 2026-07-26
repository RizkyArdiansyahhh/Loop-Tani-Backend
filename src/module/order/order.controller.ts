import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { CreateOrderResponseDto } from './response/create-order-response.dto';
import { OrderResponseDto } from './response/order-response.dto';
import { OrderPaginatedResponseDto } from './response/order-paginated-response.dto';

@ApiTags('Orders')
@ApiCookieAuth('better-auth.session_token')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Buat Pesanan Baru (Unified Endpoint)',
    description:
      'Mengubah kalkulasi checkout (BUY_NOW atau CART) menjadi transaksi Order permanen di database dengan snapshot lengkap dan pengurangan stok secara atomic.',
  })
  @ApiCreatedResponse({
    description: 'Order berhasil dibuat',
    type: CreateOrderResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validasi gagal, stok produk tidak mencukupi, atau produk tidak aktif',
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiNotFoundResponse({
    description: 'Alamat atau item keranjang tidak ditemukan',
  })
  async createOrder(
    @Session() session: UserSession,
    @Body() dto: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    return this.orderService.createOrder(session.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Daftar Pesanan User (Buyer)',
    description:
      'Mengambil daftar pesanan milik pengguna yang sedang login dengan dukungan pagination dan filter status pesanan (terurut createdAt DESC).',
  })
  @ApiOkResponse({
    description: 'Daftar pesanan berhasil diambil',
    type: OrderPaginatedResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  async getUserOrders(
    @Session() session: UserSession,
    @Query() queryDto: GetOrdersQueryDto,
  ): Promise<OrderPaginatedResponseDto> {
    return this.orderService.getUserOrders(session.user.id, queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detail Pesanan',
    description:
      'Mengambil rincian detail pesanan beserta snapshot produk, snapshot alamat, dan pricing snapshot. Hanya dapat diakses oleh buyer atau seller pesanan tersebut.',
  })
  @ApiOkResponse({
    description: 'Detail pesanan berhasil diambil',
    type: OrderResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Tidak memiliki akses ke pesanan ini',
  })
  @ApiNotFoundResponse({ description: 'Pesanan tidak ditemukan' })
  async getOrderDetail(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderDetail(session.user.id, id);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Batalkan Pesanan (Buyer)',
    description:
      'Membatalkan pesanan yang berstatus PENDING_PAYMENT dan mengembalikan stok produk secara otomatis.',
  })
  @ApiOkResponse({
    description: 'Pesanan berhasil dibatalkan dan stok produk dikembalikan',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Pesanan sudah dibayar atau tidak dapat dibatalkan',
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Tidak memiliki akses ke pesanan ini',
  })
  @ApiNotFoundResponse({ description: 'Pesanan tidak ditemukan' })
  async cancelOrder(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.cancelOrder(session.user.id, id);
  }
}
