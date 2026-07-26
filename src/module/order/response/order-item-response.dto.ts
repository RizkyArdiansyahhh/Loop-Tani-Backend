import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productSlug: string;

  @ApiProperty({ nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty()
  productPrice: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty({ nullable: true })
  categoryId: string | null;

  @ApiProperty({ nullable: true })
  categoryName: string | null;

  @ApiProperty({ nullable: true })
  unit: string | null;
}
