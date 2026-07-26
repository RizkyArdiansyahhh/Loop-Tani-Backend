import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID Order yang akan dibayar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'Jumlah pembayaran (dalam Rupiah). Dikonversi ke Prisma.Decimal di service.',
    example: 150000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'Waktu kadaluarsa pembayaran (ISO 8601). Pada tahap integrasi Xendit, field ini akan berasal dari response provider.',
    example: '2026-07-25T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}
