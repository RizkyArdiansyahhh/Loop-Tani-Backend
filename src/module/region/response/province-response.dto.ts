import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponseDto {
  @ApiProperty({ example: '14' })
  id: string;

  @ApiProperty({ example: 'RIAU' })
  name: string;
}
