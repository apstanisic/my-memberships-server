import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { PaginationParams } from '../core/pagination/pagination-options';
import { Company } from './company.entity';
import { User } from '../user/user.entity';
import { CompanyService } from './company.service';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { GetUser } from '../user/get-user.decorator';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { UpdateCompanyDto } from './company.dto';
import { PgResult } from '../core/pagination/pagination.types';

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
    @Body() data: DeepPartial<Company>,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.createCompany(data, user);
  }

  /** Remove company */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @IfAllowed()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User): Promise<Company> {
    return this.service.delete(id, user);
  }

  /** Update company */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateCompanyDto,
  ): Promise<Company> {
    return this.service.update(id, updateData);
  }
}
