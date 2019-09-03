/** Params that user can provide */
export interface PaginationOptions {
  limit?: number;
  cursor?: string;
  order?: 'ASC' | 'DESC';
<<<<<<< HEAD
  currentUrl?: string;
  query?: any;
=======
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
}

/** Parameters that are provided to paginate function.
 * Additional params can only code provide, not user */
export interface PaginationInternalParams extends PaginationOptions {
  relations?: any;
  shouldParseQuery?: boolean;
}

/**
 * For internal use. Result object from pagination.
 * Use PaginationResponse for docs
 */
export class _PaginationResult<T = any> {
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
export type PaginationResponse<T> = Promise<_PaginationResult<T>>;
