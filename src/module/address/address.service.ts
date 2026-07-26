import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // FIND ALL ACTIVE ADDRESSES
  // ─────────────────────────────────────────────
  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // ─────────────────────────────────────────────
  // FIND DEFAULT ADDRESS
  // ─────────────────────────────────────────────
  async findDefault(userId: string) {
    const defaultAddress = await this.prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
        deletedAt: null,
      },
    });

    if (!defaultAddress) {
      throw new NotFoundException('Alamat default tidak ditemukan');
    }

    return defaultAddress;
  }

  // ─────────────────────────────────────────────
  // FIND ONE ADDRESS BY ID
  // ─────────────────────────────────────────────
  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke alamat ini');
    }

    return address;
  }

  // ─────────────────────────────────────────────
  // CREATE ADDRESS
  // ─────────────────────────────────────────────
  async create(userId: string, dto: CreateAddressDto) {
    // TODO:
    // Validate provinceId-cityId-districtId-subDistrictId
    // using master region service (e.g. RajaOngkir/Biteship data source) before saving.

    // Check count of active addresses for this user
    const count = await this.prisma.address.count({
      where: {
        userId,
        deletedAt: null,
      },
    });

    // If it's the first address, it MUST be default
    const shouldBeDefault = count === 0 ? true : !!dto.isDefault;

    // Construct creation data
    const data: Prisma.AddressCreateInput = {
      user: { connect: { id: userId } },
      type: dto.type,
      label: dto.label ?? null,
      recipientName: dto.recipientName,
      recipientPhone: dto.recipientPhone,
      provinceId: dto.provinceId,
      provinceName: dto.provinceName,
      cityId: dto.cityId,
      cityName: dto.cityName,
      districtId: dto.districtId,
      districtName: dto.districtName,
      subDistrictId: dto.subDistrictId,
      subDistrictName: dto.subDistrictName,
      postalCode: dto.postalCode,
      street: dto.street,
      notes: dto.notes ?? null,
      latitude: dto.latitude !== undefined && dto.latitude !== null ? new Prisma.Decimal(dto.latitude) : null,
      longitude: dto.longitude !== undefined && dto.longitude !== null ? new Prisma.Decimal(dto.longitude) : null,
      placeId: dto.placeId ?? null,
      isDefault: shouldBeDefault,
    };

    if (shouldBeDefault && count > 0) {
      // Run inside a Prisma transaction to clear other defaults
      return this.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: {
            userId,
            deletedAt: null,
            isDefault: true,
          },
          data: { isDefault: false },
        });

        return tx.address.create({ data });
      });
    }

    return this.prisma.address.create({ data });
  }

  // ─────────────────────────────────────────────
  // UPDATE ADDRESS
  // ─────────────────────────────────────────────
  async update(id: string, userId: string, dto: UpdateAddressDto) {
    // 1. Verify existence and ownership
    await this.findOne(id, userId);

    // TODO:
    // Validate provinceId-cityId-districtId-subDistrictId
    // using master region service (e.g. RajaOngkir/Biteship data source) before saving.

    // Map dto fields to AddressUpdateInput
    const data: Prisma.AddressUpdateInput = {
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.label !== undefined && { label: dto.label ?? null }),
      ...(dto.recipientName !== undefined && { recipientName: dto.recipientName }),
      ...(dto.recipientPhone !== undefined && { recipientPhone: dto.recipientPhone }),
      ...(dto.provinceId !== undefined && { provinceId: dto.provinceId }),
      ...(dto.provinceName !== undefined && { provinceName: dto.provinceName }),
      ...(dto.cityId !== undefined && { cityId: dto.cityId }),
      ...(dto.cityName !== undefined && { cityName: dto.cityName }),
      ...(dto.districtId !== undefined && { districtId: dto.districtId }),
      ...(dto.districtName !== undefined && { districtName: dto.districtName }),
      ...(dto.subDistrictId !== undefined && { subDistrictId: dto.subDistrictId }),
      ...(dto.subDistrictName !== undefined && { subDistrictName: dto.subDistrictName }),
      ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
      ...(dto.street !== undefined && { street: dto.street }),
      ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      ...(dto.latitude !== undefined && {
        latitude: dto.latitude !== null ? new Prisma.Decimal(dto.latitude) : null,
      }),
      ...(dto.longitude !== undefined && {
        longitude: dto.longitude !== null ? new Prisma.Decimal(dto.longitude) : null,
      }),
      ...(dto.placeId !== undefined && { placeId: dto.placeId ?? null }),
    };

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  // ─────────────────────────────────────────────
  // SET DEFAULT ADDRESS
  // ─────────────────────────────────────────────
  async setDefault(id: string, userId: string) {
    // Verify existence and ownership
    await this.findOne(id, userId);

    // Perform default update in a transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Set all active user addresses to isDefault = false
      await tx.address.updateMany({
        where: {
          userId,
          deletedAt: null,
          isDefault: true,
        },
        data: { isDefault: false },
      });

      // 2. Set chosen address to isDefault = true
      return tx.address.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }

  // ─────────────────────────────────────────────
  // DELETE ADDRESS (SOFT DELETE)
  // ─────────────────────────────────────────────
  async delete(id: string, userId: string) {
    // Verify existence and ownership
    const address = await this.findOne(id, userId);

    return this.prisma.$transaction(async (tx) => {
      // 1. Soft delete the address, clearing isDefault status
      const deletedAddress = await tx.address.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          isDefault: false,
        },
      });

      // 2. If it was the default address, promote the latest created active address
      if (address.isDefault) {
        const nextDefault = await tx.address.findFirst({
          where: {
            userId,
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc', // Latest created fallback
          },
        });

        if (nextDefault) {
          await tx.address.update({
            where: { id: nextDefault.id },
            data: { isDefault: true },
          });
        }
      }

      return deletedAddress;
    });
  }
}
