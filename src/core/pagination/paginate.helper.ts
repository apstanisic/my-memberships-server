import { Repository } from 'typeorm';
import {
  PaginationInternalParams,
  PaginationResponse,
} from './pagination.types';
import { Paginator } from './Paginator';

interface PaginateProps<T> {
  repository: Repository<T>;
  criteria: Record<string, any>;
  options: PaginationInternalParams;
}
/**
 * Simmple helper function for Paginator class
 * @param repository TypeOrm repository to be used to fetch data
 * @param criteria query that needs to be have
 * @param options that tell pagination what to get
 */
export function paginate<T>({
  repository,
  criteria,
  options,
}: PaginateProps<T>): PaginationResponse<T> {
  const pag = new Paginator(options);
  pag.prepare();
  return pag.execute(repository, criteria);
}
