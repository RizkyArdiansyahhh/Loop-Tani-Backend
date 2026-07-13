import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Sayuran Segar',
    description: 'Nama kategori produk',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'sayuran-segar',
    description: 'Slug unik kategori dalam format kebab-case lowercase (e.g. hasil-tani)',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case (e.g. hasil-tani)',
  })
  slug: string;
}
