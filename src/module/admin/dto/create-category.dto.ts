import { IsEnum, IsString, Matches } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be kebab-case lowercase' })
  slug: string;

  @IsEnum(CategoryType)
  type: CategoryType;
}
