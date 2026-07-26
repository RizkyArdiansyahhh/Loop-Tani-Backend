export interface XenditWebhookPayload {
  event: string; // "payment.capture", "payment.failed", "payment_request.expiry"
  api_version?: string; // "v3"
  created: string; // Timestamp event
  data: {
    id: string; // Payment ID atau Payment Request ID
    payment_request_id?: string;
    reference_id?: string;
    status: string; // "SUCCEEDED", "FAILED", "EXPIRED"
    amount?: number;
    currency?: string;
    channel_code?: string;
    capture_timestamp?: string; // Timestamp sukses pembayaran dari Xendit
    payment_method?: {
      type?: string;
      channel_code?: string;
      card?: { channel_code?: string };
    };
    failure_code?: string;
    channel_properties?: {
      expires_at?: string;
    };
    [key: string]: any;
  };
}
