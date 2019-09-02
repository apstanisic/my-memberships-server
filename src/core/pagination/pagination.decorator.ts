/* eslint-disable dot-notation */
import { createParamDecorator } from '@nestjs/common';
import { PaginationExposedParams, PgParams } from './pagination.types';
import {
  pageField,
  limitField,
  cursorField,
  directionField,
  orderByField,
} from './pagination-query-fields';

/**
 * Convert query to pagination request object
 * @param query Query that user passed from request
 */
function convert(query: Record<string, any>): PaginationExposedParams {
  const params: PaginationExposedParams = {};

  const page = parseInt(query[pageField], 10);
  if (!Number.isNaN(page)) {
    params.page = page;
  }

  const limit = parseInt(query[limitField], 10);
  if (!Number.isNaN(limit)) {
    params.limit = limit;
  }

  params.cursor = `${query[cursorField]}`;

  let direction = query[directionField];
  if (direction !== 'ASC' && direction !== 'DESC') {
    direction = 'DESC';
  }

  params.order = {
    direction,
    column: query[orderByField] || 'createdAt',
  };

  return params;
}

/**
 * Pagination decorator for express
 * @example
 *  @Query(PgParams)
 */
export const GetPagination = createParamDecorator(
  (data, req): PgParams => {
    const { query } = req;
    return convert(query);
  },
);

/** Pagination decorator for Gql */
export const GqlPagination = createParamDecorator(
  (data, [root, args, ctx, info]) => convert(ctx.req.query),
);
