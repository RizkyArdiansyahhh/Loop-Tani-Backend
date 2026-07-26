import { ApiProperty } from '@nestjs/swagger';

export class RegencyResponseDto {
  @ApiProperty({ example: '1401' })
  id: string;

  @ApiProperty({ example: '14' })
  provinceId: string;

  @ApiProperty({ example: 'KABUPATEN KAMPAR' })
  name: string;
}
