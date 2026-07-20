import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Pesan pengguna',
    example: 'Halo, saya ingin bertanya tentang produk Anda',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({
    description: 'ID Percakapan (opsional, untuk melanjutkan percakapan)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}