import { IsOptional, IsIn, IsInt, IsBase64 } from 'class-validator';
import { Type } from 'class-transformer';
import { IsBetween } from '../is-between';

/** Validate pagination query */
export class PaginationParamsDto {
  @IsOptional()
  @IsBase64()
  cursor?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsBetween(1, 48)
  limit?: number;
}
