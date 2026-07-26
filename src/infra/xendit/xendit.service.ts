import { Injectable, Logger } from '@nestjs/common';
import { XenditClient } from './xendit.client';
import {
  CreateInvoiceOptions,
  XenditInvoiceResponse,
  XenditInvoiceCallback,
  XenditCreatePaymentRequestPayload,
  XenditPaymentRequestResponse,
} from './interfaces';
import { XenditInvoiceStatus } from './constants/xendit.constant';

@Injectable()
export class XenditService {
  private readonly logger = new Logger(XenditService.name);

  constructor(private readonly client: XenditClient) {}

  /**
   * Create Xendit Payment Request (Payments API v3)
   */
  async createPaymentRequest(
    payload: XenditCreatePaymentRequestPayload,
  ): Promise<XenditPaymentRequestResponse> {
    this.logger.log(
      `Creating Xendit Payment Request v3 for Reference ID: ${payload.reference_id}, Channel: ${payload.channel_code}, Amount: ${payload.amount}`,
    );

    return this.client.post<XenditPaymentRequestResponse>(
      '/v3/payment_requests',
      payload,
    );
  }

  /**
   * Create Xendit Payment Invoice (v3 / v2 API)
   */
  async createInvoice(options: CreateInvoiceOptions): Promise<XenditInvoiceResponse> {
    this.logger.log(`Creating Xendit Invoice for External ID: ${options.externalId}, Amount: ${options.amount}`);
    
    const payload = {
      external_id: options.externalId,
      amount: options.amount,
      payer_email: options.payerEmail,
      description: options.description || `Order #${options.externalId}`,
      invoice_duration: options.invoiceDuration || 86400, // 24 hours
      success_redirect_url: options.successRedirectUrl,
      failure_redirect_url: options.failureRedirectUrl,
      currency: options.currency || 'IDR',
      customer: options.customer
        ? {
            given_names: options.customer.givenNames,
            email: options.customer.email,
            mobile_number: options.customer.mobileNumber,
          }
        : undefined,
      items: options.items?.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        url: item.url,
      })),
      fees: options.fees?.map((fee) => ({
        type: fee.type,
        value: fee.value,
      })),
    };

    const response = await this.client.post<any>('/v2/invoices', payload);

    return {
      id: response.id,
      externalId: response.external_id || response.externalId,
      userId: response.user_id || response.userId,
      status: (response.status as XenditInvoiceStatus) || XenditInvoiceStatus.PENDING,
      merchantName: response.merchant_name || response.merchantName || 'LoopTani',
      amount: response.amount,
      payerEmail: response.payer_email || response.payerEmail,
      description: response.description,
      expiryDate: response.expiry_date || response.expiryDate,
      invoiceUrl: response.invoice_url || response.invoiceUrl,
      customer: options.customer,
      items: options.items,
      fees: options.fees,
      currency: response.currency || 'IDR',
      created: response.created,
      updated: response.updated,
    };
  }

  /**
   * Get invoice status by ID
   */
  async getInvoice(invoiceId: string): Promise<XenditInvoiceResponse> {
    const response = await this.client.get<any>(`/v2/invoices/${invoiceId}`);
    return {
      id: response.id,
      externalId: response.external_id || response.externalId,
      userId: response.user_id || response.userId,
      status: (response.status as XenditInvoiceStatus) || XenditInvoiceStatus.PENDING,
      merchantName: response.merchant_name || response.merchantName,
      amount: response.amount,
      payerEmail: response.payer_email || response.payerEmail,
      description: response.description,
      expiryDate: response.expiry_date || response.expiryDate,
      invoiceUrl: response.invoice_url || response.invoiceUrl,
      currency: response.currency || 'IDR',
      created: response.created,
      updated: response.updated,
    };
  }

  /**
   * Expire an active invoice
   */
  async expireInvoice(invoiceId: string): Promise<XenditInvoiceResponse> {
    const response = await this.client.post<any>(`/v2/invoices/${invoiceId}/expire!`, {});
    return {
      id: response.id,
      externalId: response.external_id || response.externalId,
      userId: response.user_id || response.userId,
      status: XenditInvoiceStatus.EXPIRED,
      merchantName: response.merchant_name || response.merchantName,
      amount: response.amount,
      payerEmail: response.payer_email || response.payerEmail,
      description: response.description,
      expiryDate: response.expiry_date || response.expiryDate,
      invoiceUrl: response.invoice_url || response.invoiceUrl,
      currency: response.currency || 'IDR',
      created: response.created,
      updated: response.updated,
    };
  }

  /**
   * Verify Xendit Webhook Verification Token Header
   */
  verifyWebhookToken(tokenHeader?: string): boolean {
    return this.client.verifyWebhookToken(tokenHeader);
  }
}
