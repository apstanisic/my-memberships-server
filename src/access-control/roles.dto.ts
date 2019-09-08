import { IsUUID, IsString, IsIn, IsOptional } from 'class-validator';
import { RoleName, availableRoles } from './roles.list';

/** Domain is provided trough url param. */
export class RoleDto {
  @IsString()
  @IsUUID()
  userId?: string;

  @IsString()
  @IsIn([...availableRoles])
  name?: RoleName;

  @IsOptional()
  @IsString()
  description?: string;
}

/** Some fields that are nullable at parent class here aren't */
export class CreateRoleDto extends RoleDto {
  userId: string;

  name: RoleName;

  description?: string;
}

/** All fields are optional */
export class UpdateRoleDto extends RoleDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  name?: RoleName;

  @IsOptional()
  description?: string;
}
