import { Repository, FindManyOptions } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Validator, validate } from 'class-validator';
import { Base64 } from 'js-base64';
import { BadRequestException } from '@nestjs/common';
import { PaginationResponse, _PaginationResult } from './pagination.types';
import { DefaultEntity } from '../entities/default.entity';
import { PaginationParamsDto } from './pagination-params.dto';
import { ParseCursor } from './parse-cursor';
import { GenerateCursor } from './generate-cursor';
import { HasId } from '../interfaces';
import { OrmWhere } from '../types';

/**
 * Format is: uuid;columnName;columnValue;type
 * Part ";type" is optional.
 * So if we sort by createdAt, it will look like this
 * 8a4ba6e0-6dd9-4207-b179-6d922555d38e;createdAt;1567457902579
 * If column name ends with "At", value will be inferred to be date.
 * It will order and filter:
 * @example
 *  order: { createdAt: this.order },
 *  where: {
 *    ...additionalFilter,
 *    ...parsedQuery // Automatically added
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

  /** Query from request. If filter is not provided, use this */
  private requestQuery: OrmWhere<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  /** Validate and set order, limit and cursor */
  async setOptions(paramsDto: PaginationParamsDto) {
    const params = plainToClass(PaginationParamsDto, paramsDto);

    const errors = await validate(params);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Pagination params invalid',
        JSON.stringify(errors),
      );
    }
    this.limit = params.limit || this.limit;
    this.order = params.order || 'DESC';
    this.cursor = params.cursor;
    this.requestQuery = params.query;
  }

  /* Execute query */
  async execute(filter?: OrmWhere<T>, useQuery = true): PaginationResponse<T> {
    let cursorQuery;
    if (this.cursor) {
      cursorQuery = new ParseCursor(this.cursor).query;
    } else {
      cursorQuery = {};
    }
    // If filter is not provided,
    // and user didn't forbid to use query, use query
    const whereQuery = filter && useQuery ? filter : this.requestQuery;
    if (typeof whereQuery === 'string') {
      throw new BadRequestException('Filter is string');
    }

    const result = await this.repo.find({
      where: { ...whereQuery, ...cursorQuery },
      order: { [this.orderColumn]: this.order },
      take: this.limit + 1,
    } as FindManyOptions<T>);

    return this.parseResponse(result);
  }

  /** Result will contain one item more to check if there's next page */
  private parseResponse(result: T[]) {
    const response = new _PaginationResult<T>();
    const isLastPage = this.limit >= result.length;

    let next;
    let endsAt;
    /** If it is not last page generate cursor for next page */
    if (!isLastPage && result.length > 0) {
      const nextEntity = result.pop() as T;
      next = new GenerateCursor(nextEntity, this.orderColumn).cursor;
      /* Generate last cursor for this page */
      endsAt = new GenerateCursor(result[result.length - 1]).cursor;
    }
    /* retur response */
    response.pagination = {
      isLastPage,
      next,
      endsAt,
      amount: result.length,
      startsAt: this.cursor,
    };
    response.data = result;
    return response;
  }
}
