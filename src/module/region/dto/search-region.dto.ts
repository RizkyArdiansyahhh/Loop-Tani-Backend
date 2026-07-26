import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchRegionDto {
  @ApiProperty({
    description: 'Kata kunci pencarian nama wilayah (minimal 3 karakter)',
    example: 'bandung',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'keyword wajib diisi' })
  @IsString({ message: 'keyword harus berupa string' })
  @MinLength(3, { message: 'keyword minimal 3 karakter' })
  keyword: string;
}
