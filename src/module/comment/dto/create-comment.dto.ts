import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Isi konten komentar',
    example: 'Panduan yang sangat membantu, terima kasih!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Komentar tidak boleh kosong' })
  @MaxLength(500, { message: 'Komentar tidak boleh lebih dari 500 karakter' })
  content: string;

  @ApiPropertyOptional({
    description: 'UUID dari parent comment jika membalas komentar lain',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID parent harus berupa UUID yang valid' })
  parentId?: string;
}
