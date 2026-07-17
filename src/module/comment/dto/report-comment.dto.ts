import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReportCommentDto {
  @ApiPropertyOptional({
    description: 'Alasan pelaporan komentar',
    example: 'Spam atau ujaran kebencian',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Alasan pelaporan tidak boleh lebih dari 200 karakter' })
  reason?: string;
}
