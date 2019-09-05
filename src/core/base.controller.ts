import {
  Get,
  Param,
  UseGuards,
  Body,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotImplementedException,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeepPartial } from 'typeorm';
import { BaseService } from './base.service';
import { GetPagination } from './pagination/pagination.decorator';
import { PgResult } from './pagination/pagination.types';
import { PaginationParams } from './pagination/pagination-options';
import { WithId } from './interfaces';

/**
 * T is custom service, E is entity
 */
@UseInterceptors(ClassSerializerInterceptor)
export class BaseController<T extends BaseService<E>, E extends WithId> {
  constructor(private readonly service: T) {
    throw new NotImplementedException(
      'Problem with passing params and metadata',
    );
  }

  /* Get data, filtered and paginated */
  @Get()
  find(@GetPagination() pg: PaginationParams): PgResult<E> {
    return this.service.paginate(pg);
  }

  /* Get data by id */
  @Get(':id')
  findById(@Param('id') id: string): Promise<E> {
    return this.service.findById(id);
  }

  /* Create new data */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  protected async create(@Body() data: DeepPartial<E>): Promise<E> {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /** Remove entity */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  protected remove(@Param('id') id: string): Promise<E> {
    return this.service.delete(id);
  }

  /** Update entity */
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  protected update(
    @Param('id') id: string,
    @Body() updateData: DeepPartial<E>,
  ): Promise<E> {
    try {
      return this.service.update(id, updateData);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
