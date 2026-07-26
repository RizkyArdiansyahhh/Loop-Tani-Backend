import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infra/database/prisma.service';
import { XenditService } from '../../infra/xendit/xendit.service';
import {
  XenditCreatePaymentRequestPayload,
  XenditPaymentRequestResponse,
  XenditWebhookPayload,
} from '../../infra/xendit/interfaces';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentResponseDto } from './response/payment-response.dto';
import { PaymentRequestResponseDto } from './response/payment-request-response.dto';
import {
  PAYMENT_METHOD_MAP,
  PROVIDER_CODE_MAP,
  XENDIT_WEBHOOK_EVENTS,
  TERMINAL_PAYMENT_STATUSES,
  TERMINAL_ORDER_STATUSES,
  WEBHOOK_EVENT_STATUS_MAP,
} from './constants/payment.constant';
import {
  Payment,
  Order,
  OrderItem,
  User,
  Prisma,
  PaymentStatus,
  OrderStatus,
} from '@prisma/client';

type PaymentWithOrderAndItems = Payment & {
  order: Order & { items: OrderItem[] };
};

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xenditService: XenditService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Public Methods ──────────────────────────────────────────────────

  /**
   * Create Payment record dengan status awal PENDING.
   * Belum menghubungi provider pembayaran.
   *
   * Validasi:
   * 1. Order harus ditemukan → NotFoundException
   * 2. Order harus berstatus PENDING_PAYMENT → BadRequestException
   * 3. Order belum memiliki Payment → ConflictException
   */
  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    // 1. Cari order
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order dengan ID ${dto.orderId} tidak ditemukan`,
      );
    }

    // 2. Validasi status order
    if (order.orderStatus !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Order tidak dapat dibayar. Status saat ini: ${order.orderStatus}`,
      );
    }

    // 3. Validasi 1 Order = 1 Payment
    if (order.payment) {
      throw new ConflictException(
        `Order ${dto.orderId} sudah memiliki Payment (ID: ${order.payment.id})`,
      );
    }

    // 4. Generate reference ID
    const referenceId = await this.generateReferenceId();

    // 5. Create payment
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        referenceId,
        amount: new Prisma.Decimal(dto.amount),
        expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : undefined,
      },
      include: { order: true },
    });

    this.logger.log(
      `Payment created: ${payment.id} (ref: ${referenceId}) for Order: ${dto.orderId}`,
    );

    return this.toResponseDto(payment);
  }

  /**
   * Integrasi Xendit Payments API v3: POST /v3/payment_requests
   *
   * Flow:
   * 1. Load Payment + Order + Buyer → validasi status === PENDING
   * 2. Idempotent / Resume check: jika paymentRequestId sudah ada & status PENDING,
   *    return cached response dari rawResponse (user refresh/resume checkout)
   * 3. Build payload Xendit (country, currency, env via ConfigService)
   * 4. Call Xendit API
   * 5. Update DB (paymentRequestId, providerCode, paymentMethod, expiredAt, rawResponse)
   * 6. Log timing & details
   * 7. Jika API error: JANGAN ubah DB status ke FAILED (tetap PENDING), throw BadGatewayException
   */
  async createPaymentRequest(
    paymentId: string,
    userId: string,
    dto: CreatePaymentRequestDto,
  ): Promise<PaymentRequestResponseDto> {
    // 1. Load Payment + Order + Buyer (by Payment ID, Order ID, or auto-create)
    let payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: { buyer: true },
        },
      },
    });

    if (!payment) {
      payment = await this.prisma.payment.findUnique({
        where: { orderId: paymentId },
        include: {
          order: {
            include: { buyer: true },
          },
        },
      });
    }

    if (!payment) {
      const order = await this.prisma.order.findUnique({
        where: { id: paymentId },
        include: { buyer: true, payment: true },
      });

      if (order && order.orderStatus === OrderStatus.PENDING_PAYMENT) {
        if (!order.payment) {
          const referenceId = await this.generateReferenceId();
          const newPayment = await this.prisma.payment.create({
            data: {
              orderId: order.id,
              referenceId,
              amount: order.grandTotal,
              expiredAt: order.expiredAt ?? undefined,
            },
          });
          payment = { ...newPayment, order };
        } else {
          payment = { ...order.payment, order };
        }
      }
    }

    if (!payment) {
      throw new NotFoundException(
        `Payment atau Order dengan ID ${paymentId} tidak ditemukan`,
      );
    }

    // 2. Strict Status Check
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        `Payment sudah tidak dapat diproses. Status saat ini: ${payment.status}`,
      );
    }

    // 3. Validasi Akses: Hanya buyer pemilik order
    if (payment.order.buyerId !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk memproses pembayaran ini',
      );
    }

    // 4. Strict Idempotent & Resume Check
    if (payment.paymentRequestId) {
      if (!payment.rawResponse) {
        throw new InternalServerErrorException(
          'Payment request sudah pernah dibuat tetapi cache data response tidak ditemukan',
        );
      }

      this.logger.log(
        `[Idempotent Resume] Returning cached PaymentRequest for paymentId: ${paymentId}, requestId: ${payment.paymentRequestId}`,
      );

      const cached = payment.rawResponse as unknown as XenditPaymentRequestResponse;

      return {
        paymentId: payment.id,
        paymentRequestId: payment.paymentRequestId,
        referenceId: payment.referenceId,
        paymentStatus: payment.status,
        providerStatus: cached.status || 'REQUIRES_ACTION',
        amount: payment.amount.toNumber(),
        channelCode: dto.channelCode,
        actions: cached.actions,
        expiredAt: payment.expiredAt?.toISOString() ?? null,
      };
    }

    // 5. Config Values
    const country = this.configService.get<string>('PAYMENT_COUNTRY', 'ID');
    const currency = this.configService.get<string>('PAYMENT_CURRENCY', 'IDR');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const buyer = payment.order.buyer;

    // 6. Build Xendit Payload
    const payload: XenditCreatePaymentRequestPayload = {
      reference_id: payment.referenceId,
      type: 'PAY',
      currency,
      amount: payment.amount.toNumber(),
      country,
      channel_code: dto.channelCode,
      channel_properties: {
        success_return_url: `${frontendUrl}/orders/${payment.order.id}?status=success`,
        failure_return_url: `${frontendUrl}/orders/${payment.order.id}?status=failed`,
        ...dto.channelProperties,
      },
      customer: {
        reference_id: buyer.id,
        given_names: buyer.name,
        email: buyer.email,
        mobile_number: buyer.phone ?? undefined,
      },
      description: `Pembayaran Order #${payment.order.orderNumber}`,
      metadata: {
        order_id: payment.order.id,
        order_number: payment.order.orderNumber,
        payment_id: payment.id,
        buyer_id: buyer.id,
        seller_id: payment.order.sellerId,
        environment: nodeEnv,
      },
    };

    // 7. Call Xendit API with Timing
    const startTime = Date.now();
    let xenditResponse: XenditPaymentRequestResponse;

    try {
      xenditResponse = await this.xenditService.createPaymentRequest(payload);
    } catch (err: any) {
      const elapsedMs = Date.now() - startTime;
      this.logger.error(
        `Create Payment Request Failed (elapsed: ${elapsedMs}ms) for paymentId=${paymentId}: ${err.message}`,
      );

      // IMPORTANT: Status DB TETAP PENDING agar user bisa retry
      throw new BadGatewayException(
        `Gagal menghubungi layanan pembayaran (Xendit): ${err.message}`,
      );
    }

    const elapsedMs = Date.now() - startTime;

    // 8. Update DB (Prisma atomic update)
    const providerCode =
      PROVIDER_CODE_MAP[dto.channelCode] ?? dto.channelCode;
    const paymentMethod =
      PAYMENT_METHOD_MAP[dto.channelCode] ?? 'OTHER';
    const expiredAt = xenditResponse.expires_at
      ? new Date(xenditResponse.expires_at)
      : null;

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentRequestId: xenditResponse.id,
        providerCode,
        paymentMethod,
        expiredAt,
        rawResponse: xenditResponse as unknown as Prisma.InputJsonValue,
      },
    });

    // 9. Structured Logging
    this.logger.log(
      `Create Payment Request Success: paymentId=${updatedPayment.id}, referenceId=${updatedPayment.referenceId}, paymentRequestId=${xenditResponse.id}, channelCode=${dto.channelCode}, elapsedMs=${elapsedMs}ms`,
    );

    // 10. Return Response DTO
    return {
      paymentId: updatedPayment.id,
      paymentRequestId: xenditResponse.id,
      referenceId: updatedPayment.referenceId,
      paymentStatus: updatedPayment.status,
      providerStatus: xenditResponse.status || 'REQUIRES_ACTION',
      amount: updatedPayment.amount.toNumber(),
      channelCode: dto.channelCode,
      actions: xenditResponse.actions,
      expiredAt: updatedPayment.expiredAt?.toISOString() ?? null,
    };
  }

  /**
   * Phase 3B: Xendit Webhook Handler untuk menyinkronkan status Payment & Order secara Atomic.
   *
   * Fitur Utama:
   * 1. Safe lookup by paymentRequestId / referenceId (Return 200 OK jika tidak ditemukan untuk cegah retry loop Xendit).
   * 2. Idempotency Check: Mengabaikan webhook jika status Payment / Order sudah terminal.
   * 3. Model Manajemen Stok A (Stock Reservation):
   *    - Stock sudah dikurangi saat Order dibuat.
   *    - SUCCEEDED -> Order PAID, stok TIDAK berubah.
   *    - EXPIRED / CANCELLED -> Order EXPIRED / CANCELLED, stok DI-RELEASE (increment).
   *    - FAILED -> Order tetap PENDING_PAYMENT (stok tetap reserved agar buyer bisa retry).
   * 4. Transaction: Seluruh update Payment, Order, dan Stock berjalan di satu Prisma.$transaction().
   * 5. Structured logging (oldPaymentStatus, newPaymentStatus, oldOrderStatus, newOrderStatus, elapsedMs).
   */
  async handleXenditWebhook(
    payload: XenditWebhookPayload,
  ): Promise<{ success: boolean; message: string }> {
    const startTime = Date.now();

    // 1. API Version check (jika dikirim oleh Xendit)
    if (payload.api_version && payload.api_version !== 'v3') {
      this.logger.warn(
        `Ignored webhook with unsupported API version: ${payload.api_version}`,
      );
      return {
        success: true,
        message: `Ignored API version: ${payload.api_version}`,
      };
    }

    const event = payload.event;
    const paymentRequestId =
      payload.data?.payment_request_id || payload.data?.id;
    const referenceId = payload.data?.reference_id;

    // 2. Lookup Payment (Safe Check)
    let payment: Payment | null = null;

    if (paymentRequestId) {
      payment = await this.prisma.payment.findUnique({
        where: { paymentRequestId },
      });
    }

    if (!payment && referenceId) {
      payment = await this.prisma.payment.findUnique({
        where: { referenceId },
      });
    }

    // PENCEGAHAN INFINITE RETRY XENDIT: Return 200 OK jika Payment tidak ada di DB
    if (!payment) {
      this.logger.warn(
        `[Webhook Ignored] Payment not found in DB for event=${event}, requestId=${paymentRequestId}, refId=${referenceId}`,
      );
      return {
        success: true,
        message: 'Payment not found in database, ignored',
      };
    }

    // 3. Terminal State Idempotency Check
    if (TERMINAL_PAYMENT_STATUSES.includes(payment.status)) {
      this.logger.log(
        `[Webhook Idempotent Ignore] Payment ${payment.id} is already in terminal status ${payment.status} (event: ${event})`,
      );
      return {
        success: true,
        message: `Webhook ignored: payment is already ${payment.status}`,
      };
    }

    // 4. Unsupported Event Check
    const targetStatus = WEBHOOK_EVENT_STATUS_MAP[event];
    if (!targetStatus) {
      this.logger.warn(`[Webhook Ignored] Unsupported event type: ${event}`);
      return {
        success: true,
        message: `Ignored unsupported event: ${event}`,
      };
    }

    // 5. Execute Atomic DB Update & Order Synchronization inside Prisma.$transaction()
    const syncResult = await this.prisma.$transaction(async (tx) => {
      // Load full Payment + Order + OrderItems within transaction lock
      const paymentWithOrder = await tx.payment.findUnique({
        where: { id: payment.id },
        include: {
          order: {
            include: { items: true },
          },
        },
      });

      if (!paymentWithOrder) {
        throw new NotFoundException('Payment data not found in transaction');
      }

      const oldPaymentStatus = paymentWithOrder.status;
      const oldOrderStatus = paymentWithOrder.order.orderStatus;

      // Double-check Order terminal state
      if (TERMINAL_ORDER_STATUSES.includes(oldOrderStatus) && oldOrderStatus !== OrderStatus.PENDING_PAYMENT) {
        this.logger.log(
          `[Order Idempotent Ignore] Order ${paymentWithOrder.order.id} is already in terminal status ${oldOrderStatus}`,
        );
      }

      // Process Payment update
      let updatedPay: Payment;
      switch (event) {
        case XENDIT_WEBHOOK_EVENTS.PAYMENT_CAPTURE:
        case XENDIT_WEBHOOK_EVENTS.PAYMENT_SUCCEEDED:
          updatedPay = await this.handleCaptureEvent(tx, paymentWithOrder, payload);
          break;

        case XENDIT_WEBHOOK_EVENTS.PAYMENT_FAILED:
          updatedPay = await this.handleFailedEvent(tx, paymentWithOrder, payload);
          break;

        case XENDIT_WEBHOOK_EVENTS.PAYMENT_EXPIRED:
        case XENDIT_WEBHOOK_EVENTS.INVOICE_EXPIRED:
          updatedPay = await this.handleExpiredEvent(tx, paymentWithOrder, payload);
          break;

        default:
          updatedPay = paymentWithOrder;
      }

      // Sync Order status & Stock atomically
      const newOrderStatus = await this.syncOrderStatus(
        tx,
        paymentWithOrder,
        updatedPay.status,
      );

      return {
        updatedPayment: updatedPay,
        oldPaymentStatus,
        oldOrderStatus,
        newOrderStatus,
      };
    });

    const elapsedMs = Date.now() - startTime;

    // 6. Structured Logging
    this.logger.log(
      `Webhook Sync Success: event=${event}, paymentId=${syncResult.updatedPayment.id}, referenceId=${syncResult.updatedPayment.referenceId}, paymentRequestId=${syncResult.updatedPayment.paymentRequestId ?? 'N/A'}, oldPaymentStatus=${syncResult.oldPaymentStatus}, newPaymentStatus=${syncResult.updatedPayment.status}, oldOrderStatus=${syncResult.oldOrderStatus}, newOrderStatus=${syncResult.newOrderStatus}, updatedAt=${syncResult.updatedPayment.updatedAt.toISOString()}, elapsedMs=${elapsedMs}ms`,
    );

    return {
      success: true,
      message: 'Webhook processed successfully',
    };
  }

  /**
   * Cari payment berdasarkan ID.
   * Validasi akses: hanya buyer/seller terkait order.
   */
  async findById(id: string, userId: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment dengan ID ${id} tidak ditemukan`);
    }

    this.validateAccess(payment, userId);

    return this.toResponseDto(payment);
  }

  /**
   * Cari payment berdasarkan Order ID.
   * Validasi akses: hanya buyer/seller terkait order.
   */
  async findByOrderId(
    orderId: string,
    userId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment untuk Order ${orderId} tidak ditemukan`,
      );
    }

    this.validateAccess(payment, userId);

    return this.toResponseDto(payment);
  }

  /**
   * Cari payment berdasarkan reference ID.
   * Validasi akses: hanya buyer/seller terkait order.
   */
  async findByReferenceId(
    referenceId: string,
    userId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { referenceId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment dengan Reference ID ${referenceId} tidak ditemukan`,
      );
    }

    this.validateAccess(payment, userId);

    return this.toResponseDto(payment);
  }

  /**
   * Cari payment berdasarkan Payment Request ID (dari provider).
   * Digunakan pada tahap integrasi Xendit.
   * Tidak memerlukan userId karena dipanggil oleh webhook handler internal.
   */
  async findByPaymentRequestId(
    paymentRequestId: string,
  ): Promise<(Payment & { order: Order }) | null> {
    return this.prisma.payment.findUnique({
      where: { paymentRequestId },
      include: { order: true },
    });
  }

  /**
   * Update status payment + overwrite rawResponse dengan payload terbaru.
   */
  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    rawResponse?: Record<string, any>,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status,
        rawResponse: rawResponse ?? undefined,
      },
      include: { order: true },
    });

    this.logger.log(`Payment ${id} status updated to ${status}`);

    return this.toResponseDto(payment);
  }

  /**
   * Set status → SUCCEEDED, isi paidAt dan webhookReceivedAt.
   */
  async markAsPaid(
    id: string,
    paymentId?: string,
    paymentMethod?: string,
    providerCode?: string,
    rawResponse?: Record<string, any>,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paymentId: paymentId ?? undefined,
        paymentMethod: paymentMethod ?? undefined,
        providerCode: providerCode ?? undefined,
        paidAt: new Date(),
        webhookReceivedAt: new Date(),
        rawResponse: rawResponse ?? undefined,
      },
      include: { order: true },
    });

    this.logger.log(
      `Payment ${id} marked as PAID (paymentId: ${paymentId}, method: ${paymentMethod}, provider: ${providerCode})`,
    );

    return this.toResponseDto(payment);
  }

  /**
   * Set status → EXPIRED, isi failureReason dan webhookReceivedAt.
   */
  async markAsExpired(
    id: string,
    failureReason?: string,
    rawResponse?: Record<string, any>,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.EXPIRED,
        failureReason: failureReason ?? 'Payment expired',
        webhookReceivedAt: new Date(),
        rawResponse: rawResponse ?? undefined,
      },
      include: { order: true },
    });

    this.logger.log(`Payment ${id} marked as EXPIRED: ${failureReason}`);

    return this.toResponseDto(payment);
  }

  /**
   * Set status → FAILED, isi failureReason dan webhookReceivedAt.
   * Untuk event `payment.failed` dari Xendit.
   */
  async markAsFailed(
    id: string,
    failureReason?: string,
    rawResponse?: Record<string, any>,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: failureReason ?? 'Payment failed',
        webhookReceivedAt: new Date(),
        rawResponse: rawResponse ?? undefined,
      },
      include: { order: true },
    });

    this.logger.log(`Payment ${id} marked as FAILED: ${failureReason}`);

    return this.toResponseDto(payment);
  }

  /**
   * Set status → CANCELLED, isi failureReason.
   * Untuk pembatalan oleh buyer atau admin.
   */
  async markAsCancelled(
    id: string,
    failureReason?: string,
    rawResponse?: Record<string, any>,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.CANCELLED,
        failureReason: failureReason ?? 'Payment cancelled',
        rawResponse: rawResponse ?? undefined,
      },
      include: { order: true },
    });

    this.logger.log(`Payment ${id} marked as CANCELLED: ${failureReason}`);

    return this.toResponseDto(payment);
  }

  // ─── Private Webhook Handlers & Helpers ───────────────────────────────

  /**
   * Sinkronisasi Status Order & Stock berdasarkan Model A (Stock Reservation):
   * - SUCCEEDED -> Order menjadi PAID. Stok TIDAK BERUBAH (karena sudah dikurangi saat Order dibuat).
   * - EXPIRED -> Order menjadi EXPIRED. Stok DI-RELEASE (increment).
   * - CANCELLED -> Order menjadi CANCELLED. Stok DI-RELEASE (increment).
   * - FAILED -> Order TETAP PENDING_PAYMENT (stok tetap reserved agar buyer bisa retry).
   */
  private async syncOrderStatus(
    tx: Prisma.TransactionClient,
    payment: PaymentWithOrderAndItems,
    newPaymentStatus: PaymentStatus,
  ): Promise<OrderStatus> {
    const currentOrderStatus = payment.order.orderStatus;

    // 1. Proteksi Terminal State Order: Jika order sudah di status terminal (selain PENDING_PAYMENT), skip
    if (
      TERMINAL_ORDER_STATUSES.includes(currentOrderStatus) &&
      currentOrderStatus !== OrderStatus.PENDING_PAYMENT
    ) {
      this.logger.log(
        `[Order Sync Skipped] Order ${payment.order.id} is already in terminal status ${currentOrderStatus}`,
      );
      return currentOrderStatus;
    }

    // 2. Process Order Update based on Payment Status
    switch (newPaymentStatus) {
      case PaymentStatus.SUCCEEDED: {
        // PENDING_PAYMENT -> PAID
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: OrderStatus.PAID,
          },
        });
        return OrderStatus.PAID;
      }

      case PaymentStatus.EXPIRED: {
        // PENDING_PAYMENT -> EXPIRED + Release Reserved Stock
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: OrderStatus.EXPIRED,
          },
        });

        // Release reserved stock (batch increment)
        for (const item of payment.order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
        return OrderStatus.EXPIRED;
      }

      case PaymentStatus.CANCELLED: {
        // PENDING_PAYMENT -> CANCELLED + Release Reserved Stock
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: OrderStatus.CANCELLED,
          },
        });

        // Release reserved stock (batch increment)
        for (const item of payment.order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
        return OrderStatus.CANCELLED;
      }

      case PaymentStatus.FAILED:
      default:
        // FAILED -> Order tetap PENDING_PAYMENT (stok tetap reserved agar buyer bisa retry)
        return currentOrderStatus;
    }
  }

  private async handleCaptureEvent(
    tx: Prisma.TransactionClient,
    payment: Payment,
    payload: XenditWebhookPayload,
  ): Promise<Payment> {
    const paidAt =
      this.parseProviderDate(payload.data?.capture_timestamp) ??
      this.parseProviderDate(payload.created) ??
      new Date();

    const providerCode =
      this.extractProviderCode(payload) ?? payment.providerCode;
    const paymentMethod =
      this.extractPaymentMethod(payload) ?? payment.paymentMethod;

    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paymentId: payload.data?.id ?? payment.paymentId, // Set paymentId ONLY on capture/succeeded
        paymentMethod,
        providerCode,
        paidAt,
        webhookReceivedAt: new Date(),
        rawResponse: payload as unknown as Prisma.InputJsonValue,
      },
    });
  }

  private async handleFailedEvent(
    tx: Prisma.TransactionClient,
    payment: Payment,
    payload: XenditWebhookPayload,
  ): Promise<Payment> {
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: payload.data?.failure_code ?? 'Payment failed',
        webhookReceivedAt: new Date(),
        rawResponse: payload as unknown as Prisma.InputJsonValue,
      },
    });
  }

  private async handleExpiredEvent(
    tx: Prisma.TransactionClient,
    payment: Payment,
    payload: XenditWebhookPayload,
  ): Promise<Payment> {
    const expiredAt =
      this.parseProviderDate(payload.data?.channel_properties?.expires_at) ??
      payment.expiredAt ??
      new Date();

    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.EXPIRED,
        failureReason: 'Payment request expired',
        expiredAt,
        webhookReceivedAt: new Date(),
        rawResponse: payload as unknown as Prisma.InputJsonValue,
      },
    });
  }

  /**
   * Safe parser untuk ISO date string dari provider.
   * Mencegah crash Invalid Date.
   */
  private parseProviderDate(value?: string): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * Ekstrak provider code dari webhook payload Xendit v3
   */
  private extractProviderCode(payload: XenditWebhookPayload): string | undefined {
    const channelCode =
      payload.data?.channel_code ||
      payload.data?.payment_method?.channel_code ||
      payload.data?.payment_method?.card?.channel_code;

    if (!channelCode) return undefined;
    return PROVIDER_CODE_MAP[channelCode] ?? channelCode;
  }

  /**
   * Ekstrak payment method dari webhook payload Xendit v3
   */
  private extractPaymentMethod(payload: XenditWebhookPayload): string | undefined {
    const channelCode =
      payload.data?.channel_code ||
      payload.data?.payment_method?.channel_code ||
      payload.data?.payment_method?.card?.channel_code;

    if (channelCode && PAYMENT_METHOD_MAP[channelCode]) {
      return PAYMENT_METHOD_MAP[channelCode];
    }

    if (payload.data?.payment_method?.type) {
      return payload.data.payment_method.type.toUpperCase();
    }

    return undefined;
  }

  /**
   * Generate unique reference ID format: PAY-YYYYMMDD-XXXXXX
   * Collision-proof — mirip pola generateOrderNumber di OrderService.
   */
  private async generateReferenceId(): Promise<string> {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    let attempts = 0;
    while (attempts < 10) {
      attempts++;
      const randomHex = Math.random()
        .toString(16)
        .substring(2, 8)
        .toUpperCase();
      const candidate = `PAY-${dateStr}-${randomHex}`;

      const existing = await this.prisma.payment.findUnique({
        where: { referenceId: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    throw new InternalServerErrorException(
      'Gagal membuat reference ID unik. Silakan coba lagi.',
    );
  }

  /**
   * Validasi akses: hanya buyer/seller terkait order yang boleh mengakses.
   * Return payment untuk chaining.
   */
  private validateAccess<T extends Payment & { order: Order }>(
    payment: T,
    userId: string,
  ): T {
    if (
      payment.order.buyerId !== userId &&
      payment.order.sellerId !== userId
    ) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke payment ini',
      );
    }
    return payment;
  }

  /**
   * Transform Prisma Payment entity → PaymentResponseDto.
   * Decimal diformat sebagai number, DateTime diformat sebagai string.
   * rawResponse dan webhookReceivedAt tidak dikembalikan ke frontend.
   */
  private toResponseDto(
    payment: Payment & { order: Order },
  ): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      provider: payment.provider,
      referenceId: payment.referenceId,
      paymentRequestId: payment.paymentRequestId,
      paymentId: payment.paymentId,
      paymentMethod: payment.paymentMethod,
      providerCode: payment.providerCode,
      amount: payment.amount.toNumber(),
      status: payment.status,
      failureReason: payment.failureReason,
      expiredAt: payment.expiredAt?.toISOString() ?? null,
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
