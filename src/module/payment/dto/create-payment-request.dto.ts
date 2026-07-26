import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsObject } from 'class-validator';
import { SUPPORTED_CHANNEL_CODES } from '../constants/payment.constant';

export class CreatePaymentRequestDto {
  @ApiProperty({
    description: 'Kode channel pembayaran Xendit',
    example: 'ID_BCA',
    enum: SUPPORTED_CHANNEL_CODES,
  })
  @IsIn(SUPPORTED_CHANNEL_CODES, {
    message: `channelCode harus salah satu dari: ${SUPPORTED_CHANNEL_CODES.join(', ')}`,
  })
  channelCode: string;

  @ApiPropertyOptional({
    description:
      'Properties spesifik channel (success_return_url, failure_return_url, dll.)',
    example: {
      success_return_url: 'https://looptani.id/orders/123?status=success',
    },
  })
  @IsOptional()
  @IsObject()
  channelProperties?: Record<string, string>;
}
