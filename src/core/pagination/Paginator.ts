import { Repository } from 'typeorm';
import parseQuery from '../typeorm/parseQuery';
import {
  PaginationInternalParams,
  PaginationResponse,
  PaginationResult,
} from './pagination.types';

/**
 * Class for paginating results with TypeOrm
 * Don't use this class directly, except when in specical situations.
 * If you use this class offten, that means that helper is not good.
 * Use paginate function insted.
 * @todo Add firstPageUrl, nextPageUrl, prevPageUrl
 */
export class Paginator<T> {
  /* Page which user requests, default to first */
  page: number = 1;

  /* Items per page */
  limit: number = 12;

  /* Order, excepts any column, by default show newest */
  orderDirection: string = 'DESC';

  orderColumn: string = 'createdAt';

  response: Record<any, any> = {};

  /* Should we avoid parsing query to create compatible TypeOrm query */
  shouldParseQuery?: boolean;

  /* Options to be provided to query */
  options: Record<string, any> = {};

  constructor(params: PaginationInternalParams) {
    this.page = Number(params.page) || this.page;
    this.limit = params.limit || this.limit;
    if (params.order) {
      this.orderDirection = params.order.direction;
      this.orderDirection = params.order.direction;
    }
    this.shouldParseQuery = params.shouldParseQuery;
  }

  /* Prepare skip, limit, order, etc... */
  prepare() {
    this.options = {
      skip: (this.page - 1) * this.limit,
      take: this.limit + 1,
      order: { [this.orderColumn]: this.orderDirection },
      // cache: true
    };
  }

  /* Execute query */
  async execute<T>(repo: Repository<T>, criteria: {}): PaginationResponse<T> {
    const result = await repo.find({
      where: this.shouldParseQuery ? parseQuery(criteria) : criteria,
      ...this.options,
    });
    const lastPage = this.limit >= result.length;
    if (!lastPage) {
      result.pop();
    }
    const response = new PaginationResult<T>();
    response.pagination = {
      lastPage,
      page: this.page,
      perPage: this.limit,
    };
    response.data = result;

    return response;
  }
}
