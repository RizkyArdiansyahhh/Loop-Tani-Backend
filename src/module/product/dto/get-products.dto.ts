import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { ProductCategory } from '../enums/product-category.enum';

export enum ProductSortBy {
  RECOMMENDED = 'recommended',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
}

export class GetProductsDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    description: 'Nomor halaman (dimulai dari 1)',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 12,
    default: 12,
    minimum: 1,
    maximum: 100,
    description: 'Jumlah produk per halaman (maksimal 100)',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;

  @ApiPropertyOptional({
    example: 'beras',
    description: 'Kata kunci pencarian berdasarkan judul produk (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ProductCategory,
    description: 'Filter berdasarkan kategori produk',
  })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({
    enum: ProductSortBy,
    default: ProductSortBy.RECOMMENDED,
    description:
      'Urutan tampilan produk:\n' +
      '- `recommended` — produk unggulan dulu, lalu terbaru\n' +
      '- `newest` — terbaru pertama\n' +
      '- `oldest` — terlama pertama\n' +
      '- `price-asc` — harga terendah ke tertinggi\n' +
      '- `price-desc` — harga tertinggi ke terendah',
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sort: ProductSortBy = ProductSortBy.RECOMMENDED;

  @ApiPropertyOptional({ example: 10000, description: 'Harga minimum' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000000, description: 'Harga maksimum' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'Jawa Tengah', description: 'Filter provinsi' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Semarang', description: 'Filter kota' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 4.5, description: 'Rating minimum penjual (minSellerRating)' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @Max(5)
  minSellerRating?: number;

  @ApiPropertyOptional({ example: false, description: 'Tampilkan produk yang difavoritkan saja' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  favoriteOnly?: boolean;

  @ApiPropertyOptional({ example: 'uuid-penjual', description: 'Filter berdasarkan seller ID' })
  @IsOptional()
  @IsString()
  sellerId?: string;

  @ApiPropertyOptional({ example: 'tani-makmur', description: 'Filter berdasarkan store slug' })
  @IsOptional()
  @IsString()
  storeSlug?: string;
}