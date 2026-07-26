import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderSellerSnapshotDto {
  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  storeName: string;

  @ApiProperty()
  storeSlug: string;

  @ApiProperty({ nullable: true })
  logoUrl: string | null;
}

export class OrderAddressSnapshotDto {
  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  recipientPhone: string;

  @ApiProperty()
  provinceId: string;

  @ApiProperty()
  provinceName: string;

  @ApiProperty()
  cityId: string;

  @ApiProperty()
  cityName: string;

  @ApiProperty()
  districtId: string;

  @ApiProperty()
  districtName: string;

  @ApiProperty()
  subDistrictId: string;

  @ApiProperty()
  subDistrictName: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  street: string;

  @ApiProperty({ nullable: true })
  notes: string | null;
}

export class OrderPricingSnapshotDto {
  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty()
  serviceFee: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  insuranceFee: number;

  @ApiProperty()
  applicationFee: number;

  @ApiProperty()
  grandTotal: number;

  @ApiProperty()
  totalWeight: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  buyerId: string;

  @ApiProperty({ type: OrderSellerSnapshotDto })
  seller: OrderSellerSnapshotDto;

  @ApiProperty({ type: OrderAddressSnapshotDto })
  shippingAddress: OrderAddressSnapshotDto;

  @ApiProperty({ type: OrderPricingSnapshotDto })
  pricing: OrderPricingSnapshotDto;

  @ApiProperty({ enum: OrderStatus })
  orderStatus: OrderStatus;

  @ApiProperty({ nullable: true })
  expiredAt: string | null;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
