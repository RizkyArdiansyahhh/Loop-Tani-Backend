import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'UUID produk yang ingin ditambahkan',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'Jumlah kuantitas produk yang ditambahkan (1-999)',
    minimum: 1,
    maximum: 999,
  })
  @IsInt()
  @Min(1)
  @Max(999)
  @IsNotEmpty()
  quantity: number;
}
