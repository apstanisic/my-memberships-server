import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { ValidUUID } from '../core/uuid.pipe';
import { UUID } from '../core/types';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { RoleService } from '../access-control/role.service';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { ValidRole } from '../access-control/valid-role.pipe';
import { RoleName } from '../access-control/roles.list';
import {
  CompanyRoleDto,
  CreateCompanyRoleDto,
  UpdateCompanyRoleDto,
} from './companies-roles.dto';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/roles')
export class CompaniesRolesController {
  constructor(private readonly rolesService: RoleService) {}

  @IfAllowed('read')
  @Get('')
  find(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() pg: PaginationParams,
  ) {
    return this.rolesService.paginate(pg, { domain: companyId });
  }

  @IfAllowed('read')
  @Get('users/:userId')
  findUsersRoles(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('userId', ValidUUID) userId: UUID,
  ) {
    return this.rolesService.find({ userId, domain: companyId });
  }

  @IfAllowed('read')
  @Get(':roleName')
  findAllWhoHaveGivenRole(
    @Param('roleName', ValidRole) roleName: RoleName,
    @Param('companyId', ValidUUID) companyId: UUID,
  ) {
    return this.rolesService.find({ domain: companyId, name: roleName });
  }

  @IfAllowed()
  @Post('')
  addNewRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Body() data: CreateCompanyRoleDto,
  ) {
    this.rolesService.create({ ...data, ...{ domain: companyId } });
  }

  @IfAllowed()
  @Put(':roleId')
  changeRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
    @Body() data: UpdateCompanyRoleDto,
  ) {
    return this.rolesService.update(roleId, data);
  }

  @IfAllowed()
  @Delete(':roleId')
  async deleteRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
  ) {
    const role = await this.rolesService.findOne({
      id: roleId,
      domain: companyId,
    });
    this.rolesService.delete(role);
  }
}
