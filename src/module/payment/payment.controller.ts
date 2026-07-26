import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiBadGatewayResponse,
} from '@nestjs/swagger';
import { Session, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentResponseDto } from './response/payment-response.dto';
import { PaymentRequestResponseDto } from './response/payment-request-response.dto';
import { XenditWebhookGuard } from '../../infra/xendit/guards/xendit-webhook.guard';
import { XenditWebhookPayload } from '../../infra/xendit/interfaces';

@ApiTags('Payments')
@ApiCookieAuth('better-auth.session_token')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ─── Create Payment Request (Xendit Integration) ─────────────────────

  @Post(':id/create-request')
  @ApiOperation({
    summary: 'Buat Payment Request ke Xendit (v3 API)',
    description:
      'Menghubungi Xendit Payments API v3 untuk membuat sesi pembayaran (QRIS, VA, E-Wallet, dll.). Endpoint bersifat idempotent — jika request sudah ada dan berstatus PENDING, akan mengembalikan cached actions agar frontend dapat melanjutkan pembayaran tanpa request baru ke Xendit.',
  })
  @ApiOkResponse({
    description: 'Payment request berhasil dibuat atau diambil dari cache',
    type: PaymentRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validasi channelCode gagal atau status Payment bukan PENDING',
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Bukan buyer pemilik pesanan',
  })
  @ApiNotFoundResponse({ description: 'Payment tidak ditemukan' })
  @ApiBadGatewayResponse({
    description: 'Gagal menghubungi layanan Xendit',
  })
  async createPaymentRequest(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentRequestResponseDto> {
    return this.paymentService.createPaymentRequest(
      id,
      session.user.id,
      dto,
    );
  }

  // ─── Read Endpoints ──────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary: 'Detail Payment berdasarkan ID',
    description:
      'Mengambil detail payment berdasarkan Payment ID. Hanya bisa diakses oleh buyer atau seller terkait order.',
  })
  @ApiOkResponse({
    description: 'Detail payment berhasil diambil',
    type: PaymentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Tidak memiliki akses ke payment ini',
  })
  @ApiNotFoundResponse({ description: 'Payment tidak ditemukan' })
  async getPaymentById(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.findById(id, session.user.id);
  }

  @Get('order/:orderId')
  @ApiOperation({
    summary: 'Detail Payment berdasarkan Order ID',
    description:
      'Mengambil detail payment berdasarkan Order ID. Hanya bisa diakses oleh buyer atau seller terkait order.',
  })
  @ApiOkResponse({
    description: 'Detail payment berhasil diambil',
    type: PaymentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Tidak memiliki akses ke payment ini',
  })
  @ApiNotFoundResponse({ description: 'Payment tidak ditemukan' })
  async getPaymentByOrderId(
    @Session() session: UserSession,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.findByOrderId(orderId, session.user.id);
  }

  @Get('reference/:referenceId')
  @ApiOperation({
    summary: 'Detail Payment berdasarkan Reference ID',
    description:
      'Mengambil detail payment berdasarkan Reference ID internal Loop Tani (format: PAY-YYYYMMDD-XXXXXX). Hanya bisa diakses oleh buyer atau seller terkait order.',
  })
  @ApiOkResponse({
    description: 'Detail payment berhasil diambil',
    type: PaymentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sesi tidak terautentikasi' })
  @ApiForbiddenResponse({
    description: 'Tidak memiliki akses ke payment ini',
  })
  @ApiNotFoundResponse({ description: 'Payment tidak ditemukan' })
  async getPaymentByReferenceId(
    @Session() session: UserSession,
    @Param('referenceId') referenceId: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.findByReferenceId(
      referenceId,
      session.user.id,
    );
  }
}

// ─── Webhook Controller (terpisah prefix) ────────────────────────────────

@ApiTags('Payment Webhook')
@Controller('payment')
export class PaymentWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook/xendit')
  @AllowAnonymous()
  @UseGuards(XenditWebhookGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Xendit Webhook Callback Handler (Phase 3A)',
    description:
      'Endpoint untuk menerima callback webhook dari Xendit. Diverifikasi menggunakan XenditWebhookGuard (header x-callback-token). Menyinkronkan status Payment (SUCCEEDED, FAILED, EXPIRED) secara idempotent.',
  })
  async handleWebhook(@Body() payload: Record<string, any>) {
    return this.paymentService.handleXenditWebhook(
      payload as XenditWebhookPayload,
    );
  }
}
