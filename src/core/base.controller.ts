import {
  Get,
  Param,
  UseGuards,
  Body,
  BadRequestException,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotImplementedException,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeepPartial } from 'typeorm';
import { OrmQueryPipe, OrmQuery } from './typeorm/orm-query.pipe';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { BaseService } from './base.service';
import { GetPagination } from './pagination/pagination.decorator';
import {
  PaginationOptions,
  PaginationResponse,
} from './pagination/pagination.types';
import { DefaultEntity } from './entities/default.entity';
import { HasId } from './interfaces';

/**
 * T is custom service, E is entity
 */
@UseInterceptors(ClassSerializerInterceptor)
export class BaseController<T extends BaseService<E>, E extends HasId> {
  constructor(private readonly service: T) {
    throw new NotImplementedException(
      'Problem with passing params and metadata',
    );
  }

  /* Get data, filtered and paginated */
  @Get()
  find(
    @Query() filter: Record<string, any>,
    @GetPagination() pg: PaginationOptions,
  ): PaginationResponse<E> {
    return this.service.paginate({ filter, pg });
  }

  /* Get data by id */
  @Get(':id')
  findById(@Param('id') id: string): Promise<E> {
    return this.service.findById(id);
  }

  /* Create new data */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  protected async create(
    @Body() data: DeepPartial<E>,
    @GetUser() user: User,
  ): Promise<E> {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /** Remove entity */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  protected remove(
    @Param('id') id: string,
    @GetUser() loggedUser: User,
  ): Promise<E> {
    return this.service.delete(id);
  }

  /** Update entity */
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  protected update(
    @Param('id') id: string,
    @Body() updateData: DeepPartial<E>,
    @GetUser() loggedUser: User,
  ): Promise<E> {
    try {
      return this.service.update(id, updateData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
