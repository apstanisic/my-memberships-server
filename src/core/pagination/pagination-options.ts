import { Type } from 'class-transformer';
import {
  IsOptional,
  IsBase64,
  IsIn,
  IsInt,
  IsArray,
  IsString,
  IsBoolean,
} from 'class-validator';
import { IsBetween } from '../is-between';
import { OrmWhere } from '../types';
import {
  limitField,
  orderByField,
  cursorField,
} from './_pagination-query-fields';

/** Params that user can provide */
export class PaginationParams<T = any> {
  /**
   * Create new pagination options
   * @param query Request query. Get from req.query in Express
   */
  constructor(query: Record<string, any> = {}) {
    this.where = query;
    this.limit = query[limitField];
    this.order = query[orderByField];
    this.cursor = query[cursorField];
  }

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsBetween(1, 48)
  limit?: number;

  @IsOptional()
  @IsBase64()
  cursor?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  /** Current url provided by framework. Used for generating next url */
  @IsOptional()
  @IsString()
  currentUrl?: string;

  /** All query data */
  where?: OrmWhere<T>;

  /** Relations that needs to be fetched */
  @IsArray()
  @IsString({ each: true })
  relations: string[] = [];
  /** Should query be parsed */

  @IsBoolean()
  shouldParse: boolean = true;
}
