<<<<<<< HEAD
import { IsOptional, IsIn, IsInt, IsBase64, IsUrl } from 'class-validator';
=======
import { IsOptional, IsIn, IsInt, IsBase64 } from 'class-validator';
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
import { Type } from 'class-transformer';
import { IsBetween } from '../is-between';
import { PaginationOptions } from './pagination.types';

/** Validate pagination query */
export class PaginationParamsDto implements PaginationOptions {
  @IsOptional()
  @IsBase64()
  cursor?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsBetween(1, 48)
  limit?: number;
<<<<<<< HEAD

  /** Current url provided by framework */
  currentUrl?: string;

  /** All query data */
  query?: any = {};
=======
>>>>>>> 689fcc0990449f776251d6ed6e408a7dc0159ef4
}
