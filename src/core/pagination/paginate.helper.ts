import { Repository } from 'typeorm';
import { PgResult } from './pagination.types';
import { PaginationParams } from './pagination-options';
import { Paginator } from './_paginator';
import { WithId } from '../interfaces';
import parseQuery from '../typeorm/parse-to-orm-query';
import { OrmWhere } from '../types';

interface HelperParams<T> {
  repository: Repository<T>;
  options: PaginationParams<T>;
  where?: OrmWhere<T>;
}
/**
 * Simmple helper function for Paginator class
 * @param repository TypeOrm repository to be used to fetch data
 * @param options that tell pagination what to get, and provides filter
 */
export async function paginate<T extends WithId>({
  repository,
  where,
  options,
}: HelperParams<T>): PgResult<T> {
  const paginator = new Paginator(repository);
  await paginator.setOptions(options);
  if (where) {
    return paginator.execute(parseQuery(where));
  }
  return paginator.execute();
}
