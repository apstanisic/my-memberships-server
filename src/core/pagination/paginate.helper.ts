import { Repository } from 'typeorm';
import { PgResult } from './pagination.types';
import { PaginationParams } from './pagination-options';
import { Paginator } from './_paginator';
import { WithId } from '../interfaces';

interface Params<T> {
  repository: Repository<T>;
  options: PaginationParams<T>;
}
/**
 * Simmple helper function for Paginator class
 * @param repository TypeOrm repository to be used to fetch data
 * @param options that tell pagination what to get, and provides filter
 */
export async function paginate<T extends WithId>({
  repository,
  options,
}: Params<T>): PgResult<T> {
  console.log(1);
  const paginator = new Paginator(repository);
  console.log(2);
  await paginator.setOptions(options);
  console.log(3);
  return paginator.execute();
}
