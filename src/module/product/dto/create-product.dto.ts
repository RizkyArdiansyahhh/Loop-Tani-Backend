import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductCondition } from '../enums/product-condition.enum';
import { ProductStatus } from '../enums/product-status.enum';
import { ProductCategory } from '../enums/product-category.enum';

export class CreateProductImageDto {
  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    description: 'URL gambar produk (Cloudinary/S3)',
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    example: 0,
    description: 'Urutan tampilan gambar. Gambar dengan order=0 adalah gambar utama.',
  })
  @IsInt()
  @Min(0)
  order: number;
}

export class CreateProductDto {
  @ApiProperty({
    enum: ProductCategory,
    example: ProductCategory.AGRICULTURAL_WASTE,
    description: 'Kategori produk',
  })
  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category: ProductCategory;

  @ApiProperty({
    example: 'Beras Merah Organik Premium',
    description: 'Nama/judul produk',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Beras merah organik tanpa pestisida, ditanam di sawah dataran tinggi.',
    description: 'Deskripsi lengkap produk',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 28000,
    description: 'Harga produk dalam Rupiah (minimal 0)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Jumlah stok tersedia (minimal 0)',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    enum: ProductCondition,
    example: ProductCondition.NEW,
    description: 'Kondisi produk: NEW (baru) atau USED (bekas)',
  })
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @ApiPropertyOptional({
    enum: ProductStatus,
    example: ProductStatus.DRAFT,
    default: ProductStatus.DRAFT,
    description: 'Status produk. Default DRAFT. Set ke ACTIVE agar tampil di marketplace.',
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Tandai sebagai produk unggulan (featured). Muncul di urutan teratas.',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({
    example: 'Jawa Tengah',
    description: 'Provinsi asal pengiriman',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    example: 'Semarang',
    description: 'Kota asal pengiriman',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    type: [CreateProductImageDto],
    description: 'Daftar gambar produk. Gambar dengan order=0 adalah gambar utama.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
