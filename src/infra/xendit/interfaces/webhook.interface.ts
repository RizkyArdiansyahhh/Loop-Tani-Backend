import { XenditInvoiceStatus } from '../constants/xendit.constant';

export interface XenditInvoiceCallback {
  id: string;
  externalId: string;
  userId: string;
  isHigh?: boolean;
  paymentMethod?: string;
  status: XenditInvoiceStatus;
  merchantName: string;
  amount: number;
  paidAmount?: number;
  bankCode?: string;
  paidAt?: string;
  payerEmail?: string;
  description?: string;
  adjustedReceivedAmount?: number;
  paymentChannel?: string;
  paymentDestination?: string;
  created: string;
  updated: string;
  currency: string;
}
