import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AddressType } from '@prisma/client';
import { normalizePhone } from '../../../common/utils/phone.util';

export class CreateAddressDto {
  @ApiProperty({
    enum: AddressType,
    example: AddressType.HOME,
    description: 'Jenis alamat (HOME, OFFICE, atau OTHER)',
  })
  @IsEnum(AddressType)
  @IsNotEmpty()
  type: AddressType;

  @ApiPropertyOptional({
    example: 'Rumah Utama',
    description: 'Label kustom alamat (misal: Rumah Utama, Kantor Cabang)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  label?: string;

  @ApiProperty({
    example: 'Budi Santoso',
    description: 'Nama lengkap penerima',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  recipientName: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor telepon penerima (akan dinormalisasi otomatis ke format 62xxx)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? normalizePhone(value.trim()) : value,
  )
  @Length(10, 16, {
    message: 'Nomor telepon penerima harus berdurasi antara 10 hingga 16 digit setelah dinormalisasi',
  })
  @Matches(/^62\d{8,14}$/, {
    message: 'Format nomor telepon harus berupa nomor telepon Indonesia yang valid (berawalan 62)',
  })
  recipientPhone: string;

  @ApiProperty({
    example: '32',
    description: 'ID Provinsi dari Master Data',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  provinceId: string;

  @ApiProperty({
    example: 'Jawa Barat',
    description: 'Nama Provinsi',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  provinceName: string;

  @ApiProperty({
    example: '3273',
    description: 'ID Kota/Kabupaten dari Master Data',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cityId: string;

  @ApiProperty({
    example: 'Kota Bandung',
    description: 'Nama Kota/Kabupaten',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cityName: string;

  @ApiProperty({
    example: '3273250',
    description: 'ID Kecamatan dari Master Data',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  districtId: string;

  @ApiProperty({
    example: 'Coblong',
    description: 'Nama Kecamatan',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  districtName: string;

  @ApiProperty({
    example: '3273250004',
    description: 'ID Kelurahan/Desa dari Master Data',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  subDistrictId: string;

  @ApiProperty({
    example: 'Dago',
    description: 'Nama Kelurahan/Desa',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  subDistrictName: string;

  @ApiProperty({
    example: '40135',
    description: 'Kode Pos wilayah',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  postalCode: string;

  @ApiProperty({
    example: 'Jl. Ir. H. Juanda No. 123',
    description: 'Nama jalan dan detail alamat fisik',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  street: string;

  @ApiPropertyOptional({
    example: 'Pagar hitam sebelah warung kelontong',
    description: 'Catatan tambahan untuk kurir',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  notes?: string;

  @ApiPropertyOptional({
    example: -6.89148,
    description: 'Koordinat garis lintang (latitude) untuk penanda peta',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: 107.61637,
    description: 'Koordinat garis bujur (longitude) untuk penanda peta',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    example: 'ChIJs-a21234567890',
    description: 'ID lokasi Google Maps Place',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  placeId?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Jadikan alamat ini sebagai default utama user',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
