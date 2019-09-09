/**
 * For internal use. Result object from pagination.
 * Use PaginationResponse for docs
 */
export class PaginatorResponse<T = any> {
  /** Pagination metadata */
  pagination: {
    amount: number;
    isLastPage: boolean;
    startsAt?: string;
    endsAt?: string;
    next?: string;
    previous?: string;
    [key: string]: any;
  };

  /** Retrived data */
  data: T[];
}

/** Every db query is async, so response is always Promise of PgResult */
export type PgResult<T> = Promise<PaginatorResponse<T>>;

/** Fields that user can pass in query string */
export const limitField = 'pg_limit';
export const cursorField = 'pg_cursor';
/** Values are 'ASC' or 'DESC' */
export const orderByField = 'pg_order';
