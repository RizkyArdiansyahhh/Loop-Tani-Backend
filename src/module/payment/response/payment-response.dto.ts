import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProvider, PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'ID Payment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID Order terkait',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  orderId: string;

  @ApiProperty({
    description: 'Provider pembayaran',
    enum: PaymentProvider,
    example: PaymentProvider.XENDIT,
  })
  provider: PaymentProvider;

  @ApiProperty({
    description: 'Reference ID internal Loop Tani (format: PAY-YYYYMMDD-XXXXXX)',
    example: 'PAY-20260724-AB12CD',
  })
  referenceId: string;

  @ApiPropertyOptional({
    description: 'ID payment request dari provider (Xendit Payment Request ID). Diisi setelah request ke Xendit.',
    nullable: true,
  })
  paymentRequestId: string | null;

  @ApiPropertyOptional({
    description: 'ID pembayaran aktual dari provider. Diisi saat webhook diterima.',
    nullable: true,
  })
  paymentId: string | null;

  @ApiPropertyOptional({
    description: 'Metode pembayaran: QRIS, VIRTUAL_ACCOUNT, EWALLET, CREDIT_CARD, dll.',
    nullable: true,
    example: 'VIRTUAL_ACCOUNT',
  })
  paymentMethod: string | null;

  @ApiPropertyOptional({
    description: 'Kode channel spesifik: BCA, BNI, OVO, DANA, SHOPEEPAY, dll.',
    nullable: true,
    example: 'BCA',
  })
  providerCode: string | null;

  @ApiProperty({
    description: 'Jumlah pembayaran (Rupiah)',
    example: 150000,
  })
  amount: number;

  @ApiProperty({
    description: 'Status pembayaran',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Alasan kegagalan pembayaran',
    nullable: true,
    example: 'Card declined',
  })
  failureReason: string | null;

  @ApiPropertyOptional({
    description: 'Waktu kadaluarsa pembayaran (ISO 8601)',
    nullable: true,
  })
  expiredAt: string | null;

  @ApiPropertyOptional({
    description: 'Waktu pembayaran berhasil (ISO 8601)',
    nullable: true,
  })
  paidAt: string | null;

  @ApiProperty({ description: 'Waktu pembuatan record' })
  createdAt: string;

  @ApiProperty({ description: 'Waktu terakhir diperbarui' })
  updatedAt: string;
}
