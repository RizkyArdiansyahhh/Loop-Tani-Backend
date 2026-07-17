import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Isi konten komentar yang baru',
    example: 'Komentar ini telah diupdate.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Komentar tidak boleh kosong' })
  @MaxLength(500, { message: 'Komentar tidak boleh lebih dari 500 karakter' })
  content: string;
}
