/* eslint-disable dot-notation */
import { createParamDecorator } from '@nestjs/common';
import { PaginationParams } from './pagination-options';

/**
 * Convert query to pagination request object
 * @param query Query that user passed from request
 */
function convert(query: Record<string, any>, url?: string): PaginationParams {
  const options = new PaginationParams(query);
  options.currentUrl = url;
  return options;
}

/**
 * Pagination decorator for express
 * @example
 *  @Query(PgParams)
 */
export const GetPagination = createParamDecorator(
  (data, req): PaginationParams => {
    const { query, originalUrl } = req;
    return convert(query, originalUrl);
  },
);

/** Pagination decorator for Gql */
export const GqlPagination = createParamDecorator(
  (data, [root, args, ctx, info]) => convert(ctx.req.query),
);
