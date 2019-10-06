import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PgResult } from '../core/pagination/pagination.types';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { UpdateCompanyDto } from './company.dto';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

/** Companies Controller */
@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompanyService) {}

  /** Get companies, filtered and paginated */
  @Get()
  find(@GetPagination() params: PaginationParams): PgResult<Company> {
    return this.service.paginate(params);
  }

  /** Get company by id */
  @Get(':id')
  findById(@Param('id') id: string): Promise<Company> {
    return this.service.findOne(id);
  }

  /** Create company */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: Partial<Company>,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.createCompany(data, user, {
      user,
      reason: 'Create company.',
    });
  }

  /** Remove company */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @IfAllowed()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User): Promise<Company> {
    return this.service.delete(id, { user, domain: id });
  }

  /** Update company */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateCompanyDto,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.update(id, updateData, { user, domain: id });
  }
}
