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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
<<<<<<< HEAD
import { PaginationOptions } from '../core/pagination/pagination.types';
=======
import {
  PaginationOptions,
  PaginationResponse,
} from '../core/pagination/pagination.types';
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
import { Company } from './company.entity';
import { User } from '../user/user.entity';
import { CompanyService } from './company.service';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { GetUser } from '../user/get-user.decorator';
import { IfAllowed } from '../access-control/if-allowed.decorator';

/** Companies Controller */
@Controller('companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompaniesController {
  constructor(private readonly service: CompanyService) {}

  /** Get companies, filtered and paginated */
  @Get()
<<<<<<< HEAD
  get(@Query() filter: any, @GetPagination() pg: PaginationOptions) {
    return this.service.paginate({ filter, pg });
=======
  get(@Query() query: any, @GetPagination() pg: PaginationOptions) {
    return this.service.paginate(query, pg);
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
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
    @Body() company: Partial<Company>,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.service.create({ ...company, owner: user });
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
  @UseGuards(AuthGuard('jwt'))
  @IfAllowed()
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ): Promise<Company> {
    return this.service.update(id, updateData);
  }
}
