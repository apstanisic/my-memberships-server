import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Put,
  GatewayTimeoutException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationOptions } from '../core/pagination/pagination.types';
import { Company } from './company.entity';
import { User } from '../user/user.entity';
import { CompanyService } from './company.service';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { GetUser } from '../user/get-user.decorator';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { RoleService } from '../access-control/role.service';

/** Companies Controller */
@Controller('companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompaniesController {
  constructor(
    private readonly service: CompanyService,
    private readonly roleService: RoleService,
  ) {}

  /** Get companies, filtered and paginated */
  @Get()
  find(@Query() filter: any, @GetPagination() pg: PaginationOptions) {
    return this.service.paginate({ filter, pg });
  }

  /** Get company by id */
  @Get(':id')
  findById(@Param('id') id: string): Promise<Company> {
    return this.service.findById(id);
  }

  /** Create company */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() data: Partial<Company>,
    @GetUser() user: User,
  ): Promise<Company> {
    const company = await this.service.create({ ...data, owner: user });
    await this.roleService.addRole({
      user,
      roleName: 'owner',
      domain: company,
    });
    return company;
  }

  /** Remove company */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @IfAllowed()
  remove(@Param('id') id: string): Promise<Company> {
    return this.service.delete(id);
  }

  /**
   * Update company
   * @todo updateData should not be null
   */
  @Put(':id')
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ): Promise<Company> {
    return this.service.update(id, updateData);
  }
}
