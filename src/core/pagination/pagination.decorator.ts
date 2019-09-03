/* eslint-disable dot-notation */
import { createParamDecorator } from '@nestjs/common';
import {
  limitField,
  cursorField,
  orderByField,
} from './pagination-query-fields';
import { PaginationOptions } from './pagination.types';

/**
 * Convert query to pagination request object
 * @param query Query that user passed from request
 */
<<<<<<< HEAD
function convert(query: Record<string, any>, url?: string): PaginationOptions {
  return {
    query,
    limit: query[limitField],
    order: query[orderByField],
    cursor: query[cursorField],
    currentUrl: url,
=======
function convert(query: Record<string, any>): PaginationOptions {
  return {
    limit: query[limitField],
    order: query[orderByField],
    cursor: query[cursorField],
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
  };
}

/**
 * Pagination decorator for express
 * @example
 *  @Query(PgParams)
 */
export const GetPagination = createParamDecorator(
  (data, req): PaginationOptions => {
<<<<<<< HEAD
    const { query, originalUrl } = req;
    return convert(query, originalUrl);
=======
    const { query } = req;
    return convert(query);
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
  },
);

/** Pagination decorator for Gql */
export const GqlPagination = createParamDecorator(
  (data, [root, args, ctx, info]) => convert(ctx.req.query),
);
