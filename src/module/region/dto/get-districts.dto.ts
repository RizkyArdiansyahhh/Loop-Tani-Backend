import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDistrictsDto {
  @ApiProperty({
    description: 'ID Kabupaten/Kota (kode Kemendagri)',
    example: '1401',
  })
  @IsNotEmpty({ message: 'regencyId wajib diisi' })
  @IsString({ message: 'regencyId harus berupa string' })
  regencyId: string;
}
