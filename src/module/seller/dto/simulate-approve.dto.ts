import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SellerStatus } from '@prisma/client';

export class SimulateApproveDto {
  @ApiProperty({
    enum: SellerStatus,
    example: 'ACTIVE',
    description: 'Status baru untuk simulasi approval seller',
  })
  @IsEnum(SellerStatus)
  @IsNotEmpty()
  status: SellerStatus;
}
