import { ApiProperty } from '@nestjs/swagger';

export class DistrictResponseDto {
  @ApiProperty({ example: '140101' })
  id: string;

  @ApiProperty({ example: '1401' })
  regencyId: string;

  @ApiProperty({ example: 'BANGKINANG' })
  name: string;
}
