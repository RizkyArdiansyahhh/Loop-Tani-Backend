import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetVillagesDto {
  @ApiProperty({
    description: 'ID Kecamatan (kode Kemendagri)',
    example: '140101',
  })
  @IsNotEmpty({ message: 'districtId wajib diisi' })
  @IsString({ message: 'districtId harus berupa string' })
  districtId: string;
}
