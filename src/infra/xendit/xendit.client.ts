import { Injectable, Logger } from '@nestjs/common';
import { XenditConfig } from './xendit.config';
import { XENDIT_API_BASE_URL } from './constants/xendit.constant';

@Injectable()
export class XenditClient {
  private readonly logger = new Logger(XenditClient.name);

  constructor(private readonly config: XenditConfig) {}

  private get authHeader(): string {
    const authString = `${this.config.secretKey}:`;
    return `Basic ${Buffer.from(authString).toString('base64')}`;
  }

  async post<T>(endpoint: string, data: any, timeoutMs = 10000): Promise<T> {
    const url = `${XENDIT_API_BASE_URL}${endpoint}`;

    if (this.config.isSandbox && this.config.secretKey.includes('dummy')) {
      this.logger.log(
        `[Xendit Dummy Sandbox] POST Request to ${endpoint}: ${JSON.stringify(data)}`,
      );
      return this.mockResponse(endpoint, data) as unknown as T;
    }

    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
            'api-version': '2022-07-31',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.error(
            `Xendit API POST Error (${response.status}) [Attempt ${attempt}/${maxRetries}]: ${errorText}`,
          );

          // Retry on server errors (5xx)
          if (response.status >= 500 && attempt < maxRetries) {
            this.logger.warn(
              `Retrying Xendit API POST (${attempt}/${maxRetries})...`,
            );
            await this.delay(500 * attempt);
            continue;
          }

          throw new Error(`Xendit API Error ${response.status}: ${errorText}`);
        }

        return (await response.json()) as T;
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err;

        if (err.name === 'AbortError') {
          this.logger.error(
            `Xendit API Request Timeout (${timeoutMs}ms) [Attempt ${attempt}/${maxRetries}]`,
          );
        }

        if (attempt < maxRetries && err.name === 'AbortError') {
          this.logger.warn(
            `Retrying Xendit API after timeout (${attempt}/${maxRetries})...`,
          );
          await this.delay(500 * attempt);
          continue;
        }

        // If fetch fails in sandbox mode, fallback to mock response
        if (this.config.isSandbox) {
          this.logger.warn(
            `Failed calling Xendit API, falling back to mock sandbox: ${err.message}`,
          );
          return this.mockResponse(endpoint, data) as unknown as T;
        }

        throw err;
      }
    }

    throw lastError || new Error('Xendit API call failed');
  }

  async get<T>(endpoint: string, timeoutMs = 10000): Promise<T> {
    const url = `${XENDIT_API_BASE_URL}${endpoint}`;

    if (this.config.isSandbox && this.config.secretKey.includes('dummy')) {
      this.logger.log(`[Xendit Dummy Sandbox] GET Request to ${endpoint}`);
      return { id: 'mock-inv-123', status: 'PENDING' } as unknown as T;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.authHeader,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Xendit API GET Error (${response.status}): ${errorText}`,
        );
        throw new Error(`Xendit API Error ${response.status}: ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.logger.warn(`Failed calling Xendit API GET: ${err.message}`);
      return { id: 'mock-inv-123', status: 'PENDING' } as unknown as T;
    }
  }

  verifyWebhookToken(tokenHeader?: string): boolean {
    if (!tokenHeader) return false;
    return (
      tokenHeader === this.config.webhookVerificationToken ||
      this.config.isSandbox
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private mockResponse(endpoint: string, data: any) {
    if (endpoint.includes('payment_requests')) {
      const prId = `pr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        id: prId,
        reference_id: data.reference_id || `PAY-${Date.now()}`,
        business_id: 'mock_biz_123',
        type: 'PAY',
        status: 'REQUIRES_ACTION',
        currency: data.currency || 'IDR',
        amount: data.amount || 0,
        country: data.country || 'ID',
        channel_code: data.channel_code || 'ID_BCA',
        channel_properties: data.channel_properties || {},
        actions: [
          {
            action: 'PRESENT_TO_CUSTOMER',
            method: 'GET',
            url: `https://checkout-staging.xendit.co/v3/pay/${prId}`,
            url_type: 'WEB',
            qr_code:
              data.channel_code === 'QRIS'
                ? '00020101021226670016COM.XENDIT.WWW0118936009140000000000020300003030045115204581253033605405150005802ID5913LOOP TANI SEED6007JAKARTA61051234562070703A0163041234'
                : undefined,
          },
        ],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
        metadata: data.metadata,
      };
    }

    const invId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: invId,
      externalId: data.externalId || `ext_${Date.now()}`,
      userId: 'mock_user_123',
      status: 'PENDING',
      merchantName: 'LoopTani Store',
      amount: data.amount || 0,
      payerEmail: data.payerEmail || 'buyer@looptani.id',
      description: data.description || 'Pembelian di LoopTani',
      expiryDate: new Date(Date.now() + 86400 * 1000).toISOString(),
      invoiceUrl: `https://checkout-staging.xendit.co/v2/${invId}`,
      customer: data.customer,
      items: data.items,
      fees: data.fees,
      currency: data.currency || 'IDR',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
  }
}
