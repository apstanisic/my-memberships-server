/** Params that user can provide */
export interface PaginationExposedParams {
  page?: number;
  limit?: number;
  cursor?: string;
  order?: {
    column: string;
    direction: 'ASC' | 'DESC';
  };
}

/** Prettier name for PaginationExposedParams */
export interface PgParams extends PaginationExposedParams {}

/** Parameters that are provided to paginate function */
export interface PaginationInternalParams extends PaginationExposedParams {
  relations?: any;
  shouldParseQuery?: boolean;
}

/** Response object from pagination */
interface PaginationResult<T = any> {
  pagination: {
    lastPage: boolean;
    page: number;
    perPage: number;
  };
  data: T[];
}

/** Every db query is async, so response is always Promise of PgResult */
export type PaginationResponse<T> = Promise<PaginationResult<T>>;
