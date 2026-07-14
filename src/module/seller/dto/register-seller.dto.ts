import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterSellerDto {
  // ─── Step 1 ──────────────────────────────────────────────────────────────────

  @ApiProperty({
    example: 'Toko Hijau',
    description: 'Store display name',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  storeName: string;

  @ApiProperty({
    example: 'toko-hijau',
    description:
      'URL-safe store slug. Lowercase letters, numbers, and hyphens only.',
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Store slug must be lowercase and contain only letters, numbers, and hyphens. It cannot start or end with a hyphen.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  storeSlug: string;

  // ─── Step 2 ──────────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    example: '+6281234567890',
    description: 'Store contact phone number',
  })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Matches(/^(\+62|62|0)[0-9]{7,15}$/, {
    message: 'Phone number must be a valid Indonesian phone number',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phone?: string;

  @ApiPropertyOptional({ example: 'Jawa Barat', description: 'Province' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  province?: string;

  @ApiPropertyOptional({ example: 'Bandung', description: 'City' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  city?: string;

  @ApiPropertyOptional({ example: '40123', description: 'Postal code' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{5}$/, { message: 'Postal code must be 5 digits' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'Jl. Merdeka No. 10',
    description: 'Store address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  address?: string;

  // ─── Step 3 ──────────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    example: 'Kami menjual hasil pertanian organik berkualitas tinggi.',
    description: 'Store description',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;
}
