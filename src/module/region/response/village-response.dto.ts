import { ApiProperty } from '@nestjs/swagger';

export class VillageResponseDto {
  @ApiProperty({ example: '1401011001' })
  id: string;

  @ApiProperty({ example: '140101' })
  districtId: string;

  @ApiProperty({ example: 'LANGGINI' })
  name: string;
}
