import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRegenciesDto {
  @ApiProperty({
    description: 'ID Provinsi (kode Kemendagri)',
    example: '14',
  })
  @IsNotEmpty({ message: 'provinceId wajib diisi' })
  @IsString({ message: 'provinceId harus berupa string' })
  provinceId: string;
}
