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
import { limitField, orderByField, cursorField } from './pagination.types';
import { parseNumber } from '../helpers';

/** Params that user can provide */
export class PaginationParams<T = any> {
  /**
   * Create new pagination options
   * @param query Request query. Get from req.query in Express
   */
  constructor(query: Record<string, any> = {}) {
    this.where = query;

    let order = query[orderByField];

    if (typeof order === 'string') {
      order = order.toUpperCase();
      if (order === 'ASC' || order === 'DESC') {
        this.order = order;
      }
    }

    this.limit = parseNumber(query[limitField]);

    if (typeof query[cursorField] === 'string') {
      this.cursor = query[cursorField];
    }
  }

  @IsOptional()
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
