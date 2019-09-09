import {
  LessThan,
  MoreThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
  Equal,
  Like,
  In,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { convertToObject } from '../helpers';
import { ParsedOrmWhere } from '../types';
import { type } from 'os';

/**
 * Parse query to TypeOrm valid query
 * covert hello__lt to LessThan
 * First part is property name, second part is comparison key
 * If no key is provided it will assume equal
 */
export function parseQuery<T = any>(
  query: Record<string, any> | string | null | undefined,
): ParsedOrmWhere<T> {
  // Query might be stringified json, or null. Convert to object first.
  const queryObject = convertToObject(query);
  // Here we will put processed filters
  const typeOrmQuery: ParsedOrmWhere = {};

  // For every key value pair
  Object.keys(queryObject).forEach(filter => {
    // Get value
    const value = queryObject[filter];
    // Seperate name and comparison parts
    const [name, comparison] = `${filter}`.split('__');
    // Use provided comparison part
    // Don't filter pagination
    if (filter.startsWith('pg')) return;

    switch (comparison) {
      case 'lt':
        typeOrmQuery[name] = LessThan(value);
        break;
      case 'lte':
        typeOrmQuery[name] = LessThanOrEqual(value);
        break;
      case 'gt':
        typeOrmQuery[name] = MoreThan(value);
        break;
      case 'gte':
        typeOrmQuery[name] = MoreThanOrEqual(value);
        break;
      case 'lk':
        typeOrmQuery[name] = Like(`%${value}%`);
        break;
      case 'in':
        try {
          const arr = typeof value === 'string' ? JSON.parse(value) : value;
          if (Array.isArray(arr)) {
            typeOrmQuery[name] = In(value);
          }
        } catch (error) {}
        break;
      case 'btw':
        try {
          const btw = typeof value === 'string' ? JSON.parse(value) : value;

          if (Array.isArray(btw) && btw.length === 2) {
            typeOrmQuery[name] = Between(btw[0], btw[1]);
          }
        } catch (error) {}
        break;
      case 'man':
        // Do nothing, handle manually. If not handled TypeOrm will assume Eq
        typeOrmQuery[`${name}__man`] = value;
        break;
      // If it isn't provided, assume equal
      default:
        typeOrmQuery[name] = Equal(value);
        break;
    }
  });

  return typeOrmQuery;
}
