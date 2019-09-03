import { Repository } from 'typeorm';
<<<<<<< HEAD
import { PaginationResponse, PaginationOptions } from './pagination.types';
=======
import {
  PaginationInternalParams,
  PaginationResponse,
} from './pagination.types';
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
import { Paginator } from './paginator';
import { HasId } from '../interfaces';

interface PaginateProps<T extends HasId> {
  repository: Repository<T>;
  criteria: Record<string, any>;
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
  criteria,
  options,
}: PaginateProps<T>): PaginationResponse<T> {
  const pag = new Paginator(repository);
  await pag.setOptions(options);
  return pag.execute(criteria);
}
