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
} from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  GetUser,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  RoleService,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { User } from '../users/user.entity';
import { UpdateCompanyDto } from './company.dto';
import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

/**
 * Companies Controller
 * @method getUsersCompanies is not CRUD
 * It's used to get companies for currently logged user
 * All other methods are basic crud
 */
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly service: CompaniesService,
    private readonly roleService: RoleService,
  ) {}

  /** Get companies, filtered and paginated */
  @Get()
  find(@GetPagination() params: PaginationParams): PgResult<Company> {
    return this.service.paginate(params);
  }

  /** Get companies that logged user has roles in */
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUsersCompanies(@GetUser() user: User): Promise<Company[]> {
    const roles = await this.roleService.find({ userId: user.id });
    const companyIds = roles.map(role => role.domain);
    return this.service.findByIds(companyIds);
  }

  /** Get company by id */
  @Get(':id')
  findById(@Param('id', ValidUUID) id: UUID): Promise<Company> {
    return this.service.findOne(id);
  }

  /** Create company */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: Partial<Company>,
    @GetUser() user: User,
  ): Promise<Company> {
    const amountOfCompanies = await this.service.count({ owner: user });
    if (amountOfCompanies > 5) {
      throw new ForbiddenException('You can have 5 companies max.');
    }
    return this.service.createCompany(data, user, {
      user,
      reason: 'Create company.',
    });
  }

  /** Remove company */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete(':id')
  remove(
    @Param('id', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.deleteCompany(id, { user, domain: id });
  }

  /** Update company */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('id', ValidUUID) id: UUID,
    @Body() updateData: UpdateCompanyDto,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.update(id, updateData, { user, domain: id });
  }
}
