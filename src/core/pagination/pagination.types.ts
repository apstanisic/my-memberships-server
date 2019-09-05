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
  };

  /** Retrived data */
  data: T[];
}

/** Every db query is async, so response is always Promise of PgResult */
export type PgResult<T> = Promise<PaginatorResponse<T>>;
