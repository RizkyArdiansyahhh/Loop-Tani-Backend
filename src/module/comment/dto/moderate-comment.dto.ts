import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommentStatus } from '@prisma/client';

export class ModerateCommentDto {
  @ApiProperty({
    enum: CommentStatus,
    description: 'Status moderasi komentar',
    example: 'HIDDEN',
  })
  @IsNotEmpty()
  @IsEnum(CommentStatus)
  status: CommentStatus;
}
