import { IsArray, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRolesDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
