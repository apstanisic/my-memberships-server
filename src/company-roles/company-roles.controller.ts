import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  AuthGuard,
  CreateRoleDto,
  GetPagination,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  Role,
  RoleService,
  UpdateRoleDto,
  UUID,
  ValidReason,
  ValidUUID,
  GetUser,
  IdArrayDto,
} from 'nestjs-extra';
import { In } from 'typeorm';
import { User } from '../users/user.entity';
import { CompanyRolesService } from './company-roles.service';
import { CompaniesService } from '../companies/companies.service';

/**
 * Every method is check for proper permissions.
 * This controller should not be in ac module cause it's app specific.
 * AC module should be as modular as posible.
 * @method find Filter and paginate roles that belongs to given company.
 * @method findRoleById Find role by id.
 * @method findUsersRoles Finds all roles given user has in company.
 * That is usually one role.
 * @method findAllWhoHaveARoleInCompany Find users that have role in company.
 * @method addNewRole Create new role for this company.
 * @method changeRole Change role.
 * @method deleteRole Delete role.
 */
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/roles')
export class CompaniesRolesController {
  constructor(
    private readonly rolesService: RoleService,
    private readonly companyService: CompaniesService,
    private readonly companyRolesService: CompanyRolesService,
  ) {}

  /** Get roles for this company */
  @Get('')
  find(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() pg: PaginationParams,
  ): PgResult<Role> {
    return this.rolesService.paginate(pg, { domain: companyId });
  }

  @Get('ids')
  async getRolesByIds(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Query() query: IdArrayDto,
  ): Promise<Role[]> {
    return this.rolesService.findByIds(query.ids, {
      where: { domain: companyId },
    });
  }

  /** Get all roles this user have in company */
  @Get('users/:userId')
  findUsersRoles(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('userId', ValidUUID) userId: UUID,
  ): Promise<Role[]> {
    return this.rolesService.find({ userId, domain: companyId });
  }

  /** Get all users that have given role in this company */
  @Get('name/:roleName')
  findAllWhoHaveARoleInCompany(
    @Param('roleName') roleName: string,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() pg: PaginationParams,
  ): PgResult<Role> {
    return this.rolesService.paginate(pg, {
      domain: companyId,
      name: roleName,
    });
  }

  /** Get role by id */
  @Get(':roleId')
  findRoleById(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
  ): Promise<Role> {
    return this.rolesService.findOne({ id: roleId, domain: companyId });
  }

  /** Create new role */
  @Post('')
  async addNewRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Body() data: CreateRoleDto,
    @GetUser() user: User,
    @Body('reason', ValidReason) reason?: string,
  ): Promise<Role> {
    const company = await this.companyService.findOne(companyId);
    const roles = await this.rolesService.find({ domain: company.id });

    if (!this.companyRolesService.canAddRole(company, roles.length)) {
      throw new ForbiddenException('Quota reached');
    }

    return this.rolesService.create(
      { ...data, ...{ domain: company.id } },
      { user, reason, domain: company.id },
    );
  }

  /** Change role */
  @Put(':roleId')
  async changeRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
    @Body() data: UpdateRoleDto,
    @GetUser() user: User,
    @Body('reason', ValidReason) reason?: string,
  ): Promise<Role> {
    return this.rolesService.updateWhere(
      { domain: companyId, id: roleId },
      data,
      { user, reason, domain: companyId },
    );
  }

  /** Delete role by Id that belongs to this company */
  @Delete(':roleId')
  async deleteRole(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('roleId', ValidUUID) roleId: UUID,
    @GetUser() user: User,
    @Body('reason', ValidReason) reason?: string,
  ): Promise<Role> {
    return this.rolesService.deleteWhere(
      { id: roleId, domain: companyId },
      { user, reason },
    );
  }
}
