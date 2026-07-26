import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SocialPlatform } from '@prisma/client';

export class SocialMediaItemDto {
  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ example: 'https://instagram.com/tanimakmur' })
  @IsString()
  url: string;
}

export class UpdateSellerDto {
  @ApiPropertyOptional({
    example: 'Toko Hijau',
    description: 'Nama tampilan toko',
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  storeName?: string;

  @ApiPropertyOptional({
    example: 'toko-hijau',
    description: 'URL Slug toko',
    maxLength: 60,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Store slug must be lowercase and contain only letters, numbers, and hyphens.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  storeSlug?: string;

  @ApiPropertyOptional({
    example: '+6281234567890',
    description: 'Nomor WhatsApp / telepon toko',
  })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phone?: string;

  @ApiPropertyOptional({ example: 'Jawa Barat', description: 'Provinsi' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @ApiPropertyOptional({ example: 'Bandung', description: 'Kota' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '40123', description: 'Kode pos' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 10', description: 'Alamat toko' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 'Deskripsi toko...', description: 'Deskripsi toko' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'data:image/png;base64,...', description: 'Logo toko (URL or Base64)' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'data:image/png;base64,...', description: 'Banner toko (URL or Base64)' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ type: [SocialMediaItemDto], description: 'Daftar media sosial toko' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaItemDto)
  socialMedia?: SocialMediaItemDto[];
}
