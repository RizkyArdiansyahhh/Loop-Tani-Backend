import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Pesan pengguna',
    example: 'Halo, saya ingin bertanya tentang produk Anda',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}