import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 2,
    description: 'Jumlah kuantitas produk yang diperbarui (1-999)',
    minimum: 1,
    maximum: 999,
  })
  @IsInt()
  @Min(1)
  @Max(999)
  @IsNotEmpty()
  quantity: number;
}
