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
import { CreateRoleDto, UpdateRoleDto } from '../access-control/roles.dto';
import { PgResult } from '../core/pagination/pagination.types';
import { Role } from '../access-control/roles.entity';

/**
 * Every method is check for proper permissions.
 * This controller should not be in ac module cause it's app specific.
 * AC module should be as modular as posible.
 * @method find Filter and paginate roles that belongs to given company.
 * @method findRoleById Find role by id.
 * @method findUsersRoles Finds all roles given user has in company.
 * That is usually one role.
 * @method findAllWhoHaveGivenRole Find users that have that role in company.
 * @method addNewRole Create new role for this company.
 * @method changeRole Change role.
 * @method deleteRole Delete role.
 */
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/roles')
export class CompaniesRolesController {
  constructor(private readonly rolesService: RoleService) {}

  /** Get roles for this company */
  @IfAllowed('read')
  @Get('')
  find(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() pg: PaginationParams,
  ): PgResult<Role> {
    return this.rolesService.paginate(pg, { domain: companyId });
  }

  /** Get all roles this user have in company */
  @IfAllowed('read')
  @Get('users/:userId')
  findUsersRoles(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('userId', ValidUUID) userId: UUID,
  ): Promise<Role[]> {
    return this.rolesService.find({ userId, domain: companyId });
  }

  /** Get all users that have given role in this company */
  @IfAllowed('read')
  @Get('name/:roleName')
  findAllWhoHaveGivenRole(
    @Param('roleName', ValidRole) roleName: RoleName,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() pg: PaginationParams,
  ): PgResult<Role> {
    return this.rolesService.paginate(pg, {
      domain: companyId,
      name: roleName,
    });
  }

  /** Get role by id */
  @IfAllowed('read')
  @Get(':roleId')
  findRoleById(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
  ): Promise<Role> {
    return this.rolesService.findOne({ id: roleId, domain: companyId });
  }

  /** Create new role */
  @IfAllowed()
  @Post('')
  addNewRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Body() data: CreateRoleDto,
  ): Promise<Role> {
    return this.rolesService.create({ ...data, ...{ domain: companyId } });
  }

  /** Change role */
  @IfAllowed()
  @Put(':roleId')
  async changeRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
    @Body() data: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.updateWhere(
      { domain: companyId, id: roleId },
      data,
    );
  }

  /** Delete role by Id that belongs to this company */
  @IfAllowed()
  @Delete(':roleId')
  async deleteRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
  ): Promise<Role> {
    return this.rolesService.deleteWhere({ id: roleId, domain: companyId });
  }
}
