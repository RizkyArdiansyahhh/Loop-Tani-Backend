import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { XenditPaymentAction } from '../../../infra/xendit/interfaces';

export class PaymentRequestResponseDto {
  @ApiProperty({
    description: 'ID Payment di database Loop Tani',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  paymentId: string;

  @ApiProperty({
    description: 'ID payment request dari Xendit (pr-xxx)',
    example: 'pr-90392f42-d98a-49ef-a7f3-abcezas123',
  })
  paymentRequestId: string;

  @ApiProperty({
    description: 'Reference ID internal Loop Tani',
    example: 'PAY-20260724-AB12CD',
  })
  referenceId: string;

  @ApiProperty({
    description: 'Status pembayaran internal Loop Tani',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Status pembayaran dari provider (Xendit)',
    example: 'REQUIRES_ACTION',
  })
  providerStatus: string;

  @ApiProperty({
    description: 'Jumlah pembayaran (Rupiah)',
    example: 150000,
  })
  amount: number;

  @ApiProperty({
    description: 'Kode channel yang dipilih',
    example: 'ID_BCA',
  })
  channelCode: string;

  @ApiPropertyOptional({
    description:
      'Daftar action yang dibutuhkan frontend (redirect URL, QR string, VA details, dll.)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        action: { type: 'string', example: 'PRESENT_TO_CUSTOMER' },
        method: { type: 'string', example: 'GET' },
        url: { type: 'string', example: 'https://checkout.xendit.co/...' },
        qr_code: { type: 'string' },
      },
    },
  })
  actions?: XenditPaymentAction[];

  @ApiPropertyOptional({
    description: 'Waktu kadaluarsa pembayaran (ISO 8601)',
    nullable: true,
  })
  expiredAt: string | null;
}
