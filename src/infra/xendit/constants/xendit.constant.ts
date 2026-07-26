export const XENDIT_CONFIG = 'XENDIT_CONFIG';
export const XENDIT_CLIENT = 'XENDIT_CLIENT';

export const XENDIT_API_BASE_URL = 'https://api.xendit.co';

export enum XenditInvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SETTLED = 'SETTLED',
  EXPIRED = 'EXPIRED',
}

export enum XenditCurrency {
  IDR = 'IDR',
  USD = 'USD',
}
