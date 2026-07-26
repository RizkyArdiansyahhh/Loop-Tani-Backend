import { ApiPropertyOptional } from '@nestjs/swagger';
import {
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

export class UpdateAddressDto {
  @ApiPropertyOptional({
    enum: AddressType,
    example: AddressType.HOME,
    description: 'Jenis alamat (HOME, OFFICE, atau OTHER)',
  })
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

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

  @ApiPropertyOptional({
    example: 'Budi Santoso',
    description: 'Nama lengkap penerima',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  recipientName?: string;

  @ApiPropertyOptional({
    example: '081234567890',
    description: 'Nomor telepon penerima (akan dinormalisasi otomatis ke format 62xxx)',
  })
  @IsOptional()
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
  recipientPhone?: string;

  @ApiPropertyOptional({
    example: '32',
    description: 'ID Provinsi dari Master Data',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  provinceId?: string;

  @ApiPropertyOptional({
    example: 'Jawa Barat',
    description: 'Nama Provinsi',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  provinceName?: string;

  @ApiPropertyOptional({
    example: '3273',
    description: 'ID Kota/Kabupaten dari Master Data',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cityId?: string;

  @ApiPropertyOptional({
    example: 'Kota Bandung',
    description: 'Nama Kota/Kabupaten',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cityName?: string;

  @ApiPropertyOptional({
    example: '3273250',
    description: 'ID Kecamatan dari Master Data',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  districtId?: string;

  @ApiPropertyOptional({
    example: 'Coblong',
    description: 'Nama Kecamatan',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  districtName?: string;

  @ApiPropertyOptional({
    example: '3273250004',
    description: 'ID Kelurahan/Desa dari Master Data',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  subDistrictId?: string;

  @ApiPropertyOptional({
    example: 'Dago',
    description: 'Nama Kelurahan/Desa',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  subDistrictName?: string;

  @ApiPropertyOptional({
    example: '40135',
    description: 'Kode Pos wilayah',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'Jl. Ir. H. Juanda No. 123',
    description: 'Nama jalan dan detail alamat fisik',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  street?: string;

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
}
