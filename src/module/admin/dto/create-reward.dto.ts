import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  pointsCost: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
