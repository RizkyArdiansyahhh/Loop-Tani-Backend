import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Budi Santoso',
    description: 'Full name of the user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @ApiPropertyOptional({
    example: '+6281234567890',
    description: 'Phone number in Indonesian format',
  })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Matches(/^(\+62|62|0)[0-9]{7,15}$/, {
    message: 'Phone number must be a valid Indonesian phone number',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phone?: string;
}
