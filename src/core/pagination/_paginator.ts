import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { FindManyOptions, Repository } from 'typeorm';
import { convertToObject } from '../helpers';
import { OrmWhere, WithId } from '../types';
import { PaginationParams } from './pagination-options';
import { PaginatorResponse, PgResult } from './pagination.types';
import { GenerateCursor } from './_generate-cursor';
import { ParseCursor } from './_parse-cursor';

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
export class Paginator<T extends WithId> {
  /** Repository that fetches entities */
  private repo: Repository<T>;

  /* How much entities to return */
  private limit: number = 12;

  /** Select order */
  private order: 'ASC' | 'DESC' = 'DESC';

  /** Column that should be ordered. Only using createdAt for now */
  private orderColumnName: string = 'createdAt';

  /** Cursor provided from request. If null that means that it's first page */
  private cursor?: string;

  /** Is user requesting previous or next page */
  private direction: 'prev' | 'next' = 'next';

  /** All relations that repo should fetch */
  private relations: string[] = [];

  /** Query from request. If filter is not provided, use this */
  private requestQuery: OrmWhere<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  /** Validate and set order, limit and cursor */
  async setOptions(params: PaginationParams): Promise<void> {
    const errors = await validate(params);

    if (errors.length > 0) throw new BadRequestException(errors);

    this.limit = params.limit || this.limit;
    this.order = params.order || 'DESC';
    this.cursor = params.cursor;
    this.requestQuery = params.where;
    this.relations = params.relations;
  }

  /* Execute query */
  async execute(filter?: OrmWhere<T>): PgResult<T> {
    let cursorQuery;
    if (this.cursor) {
      // If cursor exist, then it's not first page
      // INVALID
      // this.isFirstPage = false;
      const cursor = new ParseCursor(this.cursor, this.order);
      cursorQuery = cursor.query;
      this.direction = cursor.direction;
    } else {
      cursorQuery = {};
    }

    // Reverse order if prev page
    if (this.direction === 'prev') {
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    }

    // If filter is not provided,
    // and user didn't forbid to use query, use query
    const whereQuery = filter || this.requestQuery;
    if (typeof whereQuery === 'string') {
      throw new BadRequestException('Filter is string');
    }

    let where = convertToObject(whereQuery);
    where = { ...where, ...cursorQuery };

    const result = await this.repo.find({
      where,
      order: { [this.orderColumnName]: this.order, id: this.order },
      take: this.limit + 1,
      relations: this.relations,
    } as FindManyOptions<T>);

    return this.parseResponse(result);
  }

  /** Result will contain one item more to check if there's next page */
  private parseResponse(result: T[]): PaginatorResponse {
    const response = new PaginatorResponse<T>();
    let responseData = result;
    // Can we fetch next batch
    // If amount of results are same or smaller then limit, then end reached.
    // We are fetching one record more for this
    const endReached = this.limit >= result.length;
    // Remove item that was used for checking if it reached end
    let isFirstPage = false;
    let isLastPage = false;
    if (endReached) {
      // If user requested next page, that means it react last item
      if (this.direction === 'next') {
        isLastPage = true;
      } else {
        // othervise he reached first item
        isFirstPage = true;
      }
    } else {
      responseData.pop();
    }
    // If cursor is not provided then it's first page
    if (this.cursor === undefined) {
      isFirstPage = true;
    }
    // If previous page reverse order
    if (this.direction === 'prev') {
      responseData = responseData.reverse();
    }

    let next;
    let previous;
    /** If it is not last page generate cursor for next page */
    if (!isLastPage) {
      const lastItem = result[result.length - 1];
      next = new GenerateCursor(lastItem, 'next', this.orderColumnName).cursor;
    }
    if (!isFirstPage) {
      const firstItem = result[0];
      previous = new GenerateCursor(firstItem, 'prev', this.orderColumnName)
        .cursor;
    }

    /* retur response */
    response.pagination = {
      isLastPage,
      isFirstPage,
      // endsAt,
      previous,
      next,
      perPage: this.limit,
      amount: result.length,
    };
    response.data = responseData;
    return response;
  }
}
