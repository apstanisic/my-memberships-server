import { Repository, FindManyOptions } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Validator, validate } from 'class-validator';
import { Base64 } from 'js-base64';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationResponse, _PaginationResult } from './pagination.types';
import { DefaultEntity } from '../entities/default.entity';
import { PaginationParamsDto } from './pagination-params.dto';
import { ParseCursor } from './parse-cursor';
import { GenerateCursor } from './generate-cursor';
import { HasId } from '../interfaces';

/**
 * Format is:
 * column__value;id_value
 * So if we sort by createdAt, it will look like this
 * createdAt__1567457902579;id__8a4ba6e0-6dd9-4207-b179-6d922555d38e
 * Cursor always have 2nd field that is id. It is used to ensure uniquenes
 * It will order and filter:
 * @example
 *  order: { createdAt: this.order },
 *  where: {
 *    createdAt: LessThan | MoreThan(1567457902579),
 *    id: MoreThan("8a4ba6e0-6dd9-4207-b179-6d922555d38e"),
 *    ...additionalFilter
 *  },
 *  take: this.limit
 */
export class Paginator<T extends HasId> {
  /** Repository that fetches entities */
  private repo: Repository<T>;

  /* How much entities to return */
  private limit: number = 24;

  private order: 'ASC' | 'DESC' = 'DESC';

  /** Column that should be orderd */
  private orderColumn: string = 'createdAt';

  /** Cursor provided from request. If null that means that it's first page */
  private cursor?: string;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  /** Validate and set order, limit and cursor */
  async setOptions(paramsDto: PaginationParamsDto) {
    const params = plainToClass(PaginationParamsDto, paramsDto);

    const errors = await validate(params);
    if (errors.length > 0) {
      throw new BadRequestException('Pagination params invalid');
    }
    this.limit = params.limit || this.limit;
    this.order = params.orderBy || 'DESC';
    this.cursor = params.cursor;
  }

  /* Execute query */
  async execute(filter: {}): PaginationResponse<T> {
    const cursorWhere = new ParseCursor(this.cursor).parsed;

    const result = await this.repo.find({
      where: { ...cursorWhere, ...filter },
      order: { [this.orderColumn]: this.order },
      take: this.limit + 1,
    } as FindManyOptions<T>);

    return this.parseResponse(result);
  }

  /** Result will contain one item more to check if there's next page */
  private parseResponse(result: T[]) {
    const response = new _PaginationResult<T>();
    const isLastPage = this.limit >= result.length;
    console.log(isLastPage, this.limit, result.length);

    let nextCursor;
    /** If it is not last page generate cursor for next page */
    if (!isLastPage && result.length > 0) {
      const nextEntity = result.pop() as T;
      nextCursor = new GenerateCursor(nextEntity, this.orderColumn).cursor;
    }
    /** Generate last cursor for this page */
    const lastCursor = new GenerateCursor(result[result.length - 1]).cursor;
    /* retur response */
    response.pagination = {
      count: result.length,
      isLastPage,
      startsAt: this.cursor,
      next: nextCursor,
      endsAt: lastCursor,
    };
    response.data = result;
    return response;
  }
}
