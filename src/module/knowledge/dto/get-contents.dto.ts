import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContentType, ContentCategory, ContentDifficulty } from '@prisma/client';

export class GetContentsDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    description: 'Halaman ke-n',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'Jumlah konten per halaman',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'jerami',
    description: 'Pencarian kata kunci judul/isi konten',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ContentType,
    description: 'Filter berdasarkan tipe konten (ARTICLE / VIDEO)',
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({
    enum: ContentCategory,
    description: 'Filter berdasarkan kategori konten',
  })
  @IsOptional()
  @IsEnum(ContentCategory)
  category?: ContentCategory;

  @ApiPropertyOptional({
    enum: ContentDifficulty,
    description: 'Filter berdasarkan tingkat kesulitan',
  })
  @IsOptional()
  @IsEnum(ContentDifficulty)
  difficulty?: ContentDifficulty;
}
