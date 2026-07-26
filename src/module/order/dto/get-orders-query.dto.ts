import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan status order',
    enum: OrderStatus,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'status tidak valid' })
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Halaman ke berapa',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page harus berupa angka' })
  @Min(1, { message: 'page minimal 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Jumlah item per halaman',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit harus berupa angka' })
  @Min(1, { message: 'limit minimal 1' })
  limit?: number = 10;
}
