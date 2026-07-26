import { ApiProperty } from '@nestjs/swagger';

export enum RegionType {
  PROVINCE = 'PROVINCE',
  REGENCY = 'REGENCY',
  DISTRICT = 'DISTRICT',
  VILLAGE = 'VILLAGE',
}

export class RegionSearchItemDto {
  @ApiProperty({ example: '1401' })
  id: string;

  @ApiProperty({ example: 'KABUPATEN KAMPAR' })
  name: string;

  @ApiProperty({ enum: RegionType, example: RegionType.REGENCY })
  type: RegionType;

  @ApiProperty({ example: 'KABUPATEN KAMPAR, RIAU' })
  fullName: string;
}
