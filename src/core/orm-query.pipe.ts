import { PipeTransform, Injectable } from '@nestjs/common';
import { FindOperator } from 'typeorm';
import parseQuery from './parseQuery';

export type OrmQuery<T = any, U = FindOperator<T>> = Record<string, U>;

/* Wrapper around parseQuery function to be used as a pipe */
@Injectable()
export class OrmQueryPipe implements PipeTransform {
  transform(value: any): OrmQuery {
    return this.parse(value);
  }

  parse(query: Record<string, any>): OrmQuery {
    return parseQuery(query);
  }
}
