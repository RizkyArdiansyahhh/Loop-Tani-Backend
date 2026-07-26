import { XenditInvoiceStatus } from '../constants/xendit.constant';

export interface XenditCustomer {
  givenNames?: string;
  email?: string;
  mobileNumber?: string;
}

export interface XenditInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  url?: string;
}

export interface XenditInvoiceFee {
  type: string;
  value: number;
}

export interface CreateInvoiceOptions {
  externalId: string;
  amount: number;
  payerEmail?: string;
  description?: string;
  invoiceDuration?: number; // In seconds (default: 86400 / 24 hours)
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  currency?: string;
  customer?: XenditCustomer;
  items?: XenditInvoiceItem[];
  fees?: XenditInvoiceFee[];
}

export interface XenditInvoiceResponse {
  id: string;
  externalId: string;
  userId: string;
  status: XenditInvoiceStatus;
  merchantName: string;
  amount: number;
  payerEmail?: string;
  description?: string;
  expiryDate: string;
  invoiceUrl: string;
  customer?: XenditCustomer;
  items?: XenditInvoiceItem[];
  fees?: XenditInvoiceFee[];
  shouldSendEmail?: boolean;
  created: string;
  updated: string;
  currency: string;
}
