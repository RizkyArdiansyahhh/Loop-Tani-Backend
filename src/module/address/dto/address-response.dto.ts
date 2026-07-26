import { Address, AddressType } from '@prisma/client';

export class AddressResponseDto {
  id: string;
  userId: string;
  type: AddressType;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  postalCode: string;
  street: string;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Address): AddressResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      label: entity.label,
      recipientName: entity.recipientName,
      recipientPhone: entity.recipientPhone,
      provinceId: entity.provinceId,
      provinceName: entity.provinceName,
      cityId: entity.cityId,
      cityName: entity.cityName,
      districtId: entity.districtId,
      districtName: entity.districtName,
      subDistrictId: entity.subDistrictId,
      subDistrictName: entity.subDistrictName,
      postalCode: entity.postalCode,
      street: entity.street,
      notes: entity.notes,
      // Convert Prisma Decimal to standard JS number safely
      latitude: entity.latitude ? entity.latitude.toNumber() : null,
      longitude: entity.longitude ? entity.longitude.toNumber() : null,
      placeId: entity.placeId,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromEntities(entities: Address[]): AddressResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
