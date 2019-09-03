import { IsOptional, IsIn, IsInt, IsBase64 } from 'class-validator';
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
}
