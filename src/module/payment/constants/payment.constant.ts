import { PaymentStatus, OrderStatus } from '@prisma/client';

export const SUPPORTED_CHANNEL_CODES = [
  // Virtual Account
  'ID_BCA',
  'ID_BNI',
  'ID_BRI',
  'ID_MANDIRI',
  'ID_PERMATA',
  'ID_BSI',
  'ID_BJB',
  'ID_CIMB',
  'ID_SAHABAT_SAMPOERNA',
  // E-Wallet
  'ID_OVO',
  'ID_DANA',
  'ID_SHOPEEPAY',
  'ID_LINKAJA',
  'ID_ASTRAPAY',
  'ID_JENIUSPAY',
  // QR
  'QRIS',
  // Paylater
  'ID_KREDIVO',
  'ID_AKULAKU',
  'ID_ATOME',
  // Cards
  'CARDS',
] as const;

export type SupportedChannelCode = (typeof SUPPORTED_CHANNEL_CODES)[number];

export const PAYMENT_METHOD_MAP: Record<string, string> = {
  ID_BCA: 'VIRTUAL_ACCOUNT',
  ID_BNI: 'VIRTUAL_ACCOUNT',
  ID_BRI: 'VIRTUAL_ACCOUNT',
  ID_MANDIRI: 'VIRTUAL_ACCOUNT',
  ID_PERMATA: 'VIRTUAL_ACCOUNT',
  ID_BSI: 'VIRTUAL_ACCOUNT',
  ID_BJB: 'VIRTUAL_ACCOUNT',
  ID_CIMB: 'VIRTUAL_ACCOUNT',
  ID_SAHABAT_SAMPOERNA: 'VIRTUAL_ACCOUNT',
  ID_OVO: 'EWALLET',
  ID_DANA: 'EWALLET',
  ID_SHOPEEPAY: 'EWALLET',
  ID_LINKAJA: 'EWALLET',
  ID_ASTRAPAY: 'EWALLET',
  ID_JENIUSPAY: 'EWALLET',
  QRIS: 'QRIS',
  ID_KREDIVO: 'PAYLATER',
  ID_AKULAKU: 'PAYLATER',
  ID_ATOME: 'PAYLATER',
  CARDS: 'CREDIT_CARD',
};

export const PROVIDER_CODE_MAP: Record<string, string> = {
  ID_BCA: 'BCA',
  ID_BNI: 'BNI',
  ID_BRI: 'BRI',
  ID_MANDIRI: 'MANDIRI',
  ID_PERMATA: 'PERMATA',
  ID_BSI: 'BSI',
  ID_BJB: 'BJB',
  ID_CIMB: 'CIMB',
  ID_SAHABAT_SAMPOERNA: 'SAMPOERNA',
  ID_OVO: 'OVO',
  ID_DANA: 'DANA',
  ID_SHOPEEPAY: 'SHOPEEPAY',
  ID_LINKAJA: 'LINKAJA',
  ID_ASTRAPAY: 'ASTRAPAY',
  ID_JENIUSPAY: 'JENIUSPAY',
  QRIS: 'QRIS',
  ID_KREDIVO: 'KREDIVO',
  ID_AKULAKU: 'AKULAKU',
  ID_ATOME: 'ATOME',
  CARDS: 'CARDS',
};

export const XENDIT_WEBHOOK_EVENTS = {
  PAYMENT_CAPTURE: 'payment.capture',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_EXPIRED: 'payment_request.expiry',
  INVOICE_EXPIRED: 'invoice.expired',
} as const;

export const TERMINAL_PAYMENT_STATUSES: PaymentStatus[] = [
  PaymentStatus.SUCCEEDED,
  PaymentStatus.FAILED,
  PaymentStatus.EXPIRED,
  PaymentStatus.CANCELLED,
];

export const TERMINAL_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.EXPIRED,
];

export const WEBHOOK_EVENT_STATUS_MAP: Record<string, PaymentStatus> = {
  [XENDIT_WEBHOOK_EVENTS.PAYMENT_CAPTURE]: PaymentStatus.SUCCEEDED,
  [XENDIT_WEBHOOK_EVENTS.PAYMENT_SUCCEEDED]: PaymentStatus.SUCCEEDED,
  [XENDIT_WEBHOOK_EVENTS.PAYMENT_FAILED]: PaymentStatus.FAILED,
  [XENDIT_WEBHOOK_EVENTS.PAYMENT_EXPIRED]: PaymentStatus.EXPIRED,
  [XENDIT_WEBHOOK_EVENTS.INVOICE_EXPIRED]: PaymentStatus.EXPIRED,
};
