import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ContentType, ContentDifficulty } from '@prisma/client';

export class CreateKnowledgeDto {
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  category: string; // Dynamic category slug

  @IsEnum(ContentDifficulty)
  difficulty: ContentDifficulty;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  rewardPoint?: number;

  @IsOptional()
  @IsInt()
  estimatedReadingMinutes?: number;

  @IsOptional()
  @IsInt()
  videoDuration?: number;

  @IsOptional()
  @IsString()
  cloudinaryPublicId?: string;

  @IsOptional()
  @IsString()
  secureUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
