import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SellerStatus } from '@prisma/client';

export class VerifySellerDto {
  @IsEnum(SellerStatus)
  status: SellerStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
