import { IsUUID, IsString, IsIn, IsOptional } from 'class-validator';
import { RoleName, availableRoles } from '../access-control/roles.list';
import { UUID } from '../core/types';

/** Domain is provided trough url param. */
export class CompanyRoleDto {
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
export class CreateCompanyRoleDto extends CompanyRoleDto {
  userId: string;

  name: RoleName;

  description?: string;
}

export class UpdateCompanyRoleDto extends CompanyRoleDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  name?: RoleName;

  @IsOptional()
  description: string;
}
