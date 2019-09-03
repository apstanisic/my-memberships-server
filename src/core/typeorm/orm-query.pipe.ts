import { PipeTransform, Injectable } from '@nestjs/common';
import { FindOperator } from 'typeorm';
import parseQuery from './parse-to-orm-query';

export type OrmQuery<T = any, U = FindOperator<T>> = Record<string, U>;

/**
 * Wrapper around parseQuery function to be used as a pipe
 * @example
 *   method(@Body(OrmQueryPipe) user: OrmQuery) {}
 */
@Injectable()
export class OrmQueryPipe implements PipeTransform {
  transform(value: any): OrmQuery {
    return parseQuery(value);
  }
}
