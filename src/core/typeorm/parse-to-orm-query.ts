import {
  LessThan,
  MoreThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
  Equal,
  Like,
  FindOperator,
  In,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { convertToObject } from '../helpers';

/**
 * Parse query to TypeOrm valid query
 * covert hello__lt to LessThan
 * First part is property name, second part is comparison key
 * If no key is provided it will assume equal
 */
type OrmQuery<T = any> = Record<string, FindOperator<T>>;
export default function parseQuery(
  query: Record<string, any> | string | null | undefined,
) {
  // Query might be stringified json, or null. Convert to object first.
  const queryObject = convertToObject(query);
  // Here we will put processed filters
  const typeOrmQuery: OrmQuery = {};

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
      case 'in':
        try {
          const convertedArray = JSON.parse(value);
          if (!Array.isArray(convertedArray)) throw new Error('Not array');
          typeOrmQuery[name] = In(value);
        } catch (error) {
          throw new BadRequestException(`${name} is invalid. Value: ${value}`);
        }
        break;
      case 'lk':
        typeOrmQuery[name] = Like(`%${value}%`);
        break;
      case 'btw':
        if (Array.isArray(value) && value.length === 2) {
          typeOrmQuery[name] = Between(value[0], value[1]);
        }
        break;
      case 'pg':
        break;
      case 'man':
        // Do nothing, handle manually
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
