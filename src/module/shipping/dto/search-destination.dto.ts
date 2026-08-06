import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchDestinationDto {
  @ApiProperty({
    example: 'Pekanbaru',
    description: 'Kata kunci pencarian nama kota, kabupaten, atau kecamatan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  search: string;
}
