import { IsUUID, IsString, IsIn, IsOptional } from 'class-validator';
import { RoleName, availableRoles } from './roles.list';
import { UUID } from '../core/types';

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

/** To delete role you need everything for creationg, plus domain to delete */
export class DeleteRoleDto extends UpdateRoleDto {
  @IsString()
  @IsUUID()
  domain: string;

  @IsString()
  @IsUUID()
  id: string;
}
