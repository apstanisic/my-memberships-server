import { Repository } from 'typeorm';
import parseQuery from './parseQuery';

/* TODO: Add firstPageUrl, nextPageUrl, prevPageUrl */
/* Class for paginating results with TypeOrm */
class Paginator<T> {
  /* Page which user requests, default to first */
  page: number = 1;

  /* Items per page */
  limit: number = 12;

  /* Order, excepts any column, by default show newest */
  order: Record<string, any> = { createdAt: 'DESC' };

  response: Record<any, any> = {};

  /* Should we avoid parsing query to create compatible TypeOrm query */
  shouldParseQuery?: boolean;

  /* Options to be provided to query */
  options: Record<string, any> = {};

  constructor(params: Params) {
    this.page = Number(params.page) || this.page;
    this.limit = params.limit || this.limit;
    this.order = params.order || this.order;
    this.shouldParseQuery = params.shouldParseQuery;
  }

  /* Prepare skip, limit, order, etc... */
  prepare() {
    this.options = {
      skip: (this.page - 1) * this.limit,
      take: this.limit + 1,
      order: this.order,
      // cache: true
    };
  }

  /* Execute query */
  async execute<T>(repo: Repository<T>, criteria: {}) {
    const result = await repo.find({
      where: this.shouldParseQuery ? parseQuery(criteria) : criteria,
      ...this.options,
    });
    const lastPage = this.limit >= result.length;
    if (!lastPage) {
      result.pop();
    }
    return {
      pagination: {
        lastPage,
        page: this.page,
        perPage: this.limit,
      },
      data: result,
    };
  }
}
/* Parameters that are provided to paginate function */
interface Params {
  page: string | number;
  limit?: number;
  order?: Record<string, any>;
  relations?: any;
  shouldParseQuery?: boolean;
}

/* Response object from pagination */
export interface PaginationResult<T = any> {
  pagination: {
    lastPage: boolean;
    page: number;
    perPage: number;
  };
  data: T[];
}

interface PaginateProps<T> {
  repository: Repository<T>;
  criteria: Record<string, any>;
  options: Params;
}

/**
 * Helper method for Paginator class
 * @param repository TypeOrm repository to be used to fetch data
 * @param criteria query that needs to be have
 * @param options that tell pagination what to get
 */
export function paginate<T>({
  repository,
  criteria: query,
  options,
}: PaginateProps<T>) {
  const pag = new Paginator(options);
  pag.prepare();
  return pag.execute(repository, query);
}
