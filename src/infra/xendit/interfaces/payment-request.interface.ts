export interface XenditCreatePaymentRequestPayload {
  reference_id: string;
  type: 'PAY';
  currency: string;
  amount: number;
  country: string;
  channel_code: string;
  channel_properties: Record<string, string>;
  customer?: {
    reference_id?: string;
    given_names?: string;
    email?: string;
    mobile_number?: string;
  };
  description?: string;
  metadata?: Record<string, any>;
}

export interface XenditPaymentAction {
  action: string; // AUTH, REDIRECT, PRESENT_TO_CUSTOMER
  method: string; // GET, POST
  url?: string;
  url_type?: string; // WEB, DEEPLINK, API
  qr_code?: string; // QR string for QRIS
}

export interface XenditPaymentRequestResponse {
  id: string; // Payment Request ID (pr-xxx)
  reference_id: string;
  business_id?: string;
  type: string;
  status: string; // REQUIRES_ACTION, PENDING, SUCCEEDED, FAILED
  currency: string;
  amount: number;
  country: string;
  channel_code: string;
  channel_properties?: Record<string, any>;
  actions?: XenditPaymentAction[];
  payment_method?: Record<string, any>;
  created: string;
  updated: string;
  expires_at?: string; // ISO 8601
  metadata?: Record<string, any>;
}
