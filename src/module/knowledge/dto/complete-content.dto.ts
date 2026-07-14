import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CompleteContentDto {
  @ApiPropertyOptional({
    example: 95.5,
    description: 'Persentase scroll halaman (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  scrollPercentage?: number;

  @ApiPropertyOptional({
    example: 120,
    description: 'Durasi aktif membaca dalam detik',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  activeReadingSeconds?: number;

  @ApiPropertyOptional({
    example: 85.0,
    description: 'Persentase video yang ditonton (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  watchedPercentage?: number;
}
