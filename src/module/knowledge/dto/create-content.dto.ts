import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ContentType, ContentCategory, ContentDifficulty, ContentStatus } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({
    enum: ContentType,
    example: ContentType.ARTICLE,
    description: 'Tipe konten (ARTICLE / VIDEO)',
  })
  @IsEnum(ContentType)
  @IsNotEmpty()
  type: ContentType;

  @ApiProperty({
    example: 'Cara Mengolah Jerami Padi Menjadi Briket',
    description: 'Judul konten',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Isi lengkap artikel tentang briket...',
    description: 'Isi teks/deskripsi konten',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    enum: ContentCategory,
    example: ContentCategory.OLAHAN,
    description: 'Kategori konten',
  })
  @IsEnum(ContentCategory)
  @IsNotEmpty()
  category: ContentCategory;

  @ApiProperty({
    enum: ContentDifficulty,
    example: ContentDifficulty.PEMULA,
    description: 'Tingkat kesulitan',
  })
  @IsEnum(ContentDifficulty)
  @IsNotEmpty()
  difficulty: ContentDifficulty;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
    description: 'URL gambar cover/thumbnail',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Poin reward yang didapatkan',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  rewardPoint?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Estimasi waktu membaca dalam menit (untuk artikel)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedReadingMinutes?: number;

  @ApiPropertyOptional({
    example: 360,
    description: 'Durasi video dalam detik (untuk video)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  videoDuration?: number;

  @ApiPropertyOptional({
    example: 'loop-tani/videos/123456',
    description: 'Cloudinary Public ID (untuk video)',
  })
  @IsOptional()
  @IsString()
  cloudinaryPublicId?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/video/upload/video.mp4',
    description: 'Cloudinary Secure URL (untuk video)',
  })
  @IsOptional()
  @IsString()
  secureUrl?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/video/upload/video.jpg',
    description: 'Cloudinary Video Thumbnail URL (untuk video)',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.DRAFT,
    description: 'Status publikasi konten',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
