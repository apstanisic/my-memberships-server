import { Repository } from 'typeorm';
import { PaginationResponse, PaginationOptions } from './pagination.types';
import { Paginator } from './paginator';
import { HasId } from '../interfaces';
import { OrmWhere } from '../types';

interface PaginateProps<T extends HasId> {
  repository: Repository<T>;
  filter: OrmWhere<T>;
  options: PaginationOptions;
}
/**
 * Simmple helper function for Paginator class
 * @param repository TypeOrm repository to be used to fetch data
 * @param criteria query that needs to be have
 * @param options that tell pagination what to get
 */
export async function paginate<T extends HasId>({
  repository,
  filter,
  options,
}: PaginateProps<T>): PaginationResponse<T> {
  const pag = new Paginator(repository);
  await pag.setOptions(options);
  return pag.execute(filter);
}
