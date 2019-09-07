import { FindConditions, ObjectLiteral, FindOperator } from 'typeorm';

/** Types that can be passed as TypeOrm where param */
export type OrmWhere<T = any> =
  | FindConditions<T>[]
  | FindConditions<T>
  | ObjectLiteral
  | string
  | undefined;

export type ParsedOrmWhere<T = any> = { [key: string]: FindOperator<T> };

/** Regular string, just to make it more clear what type of string it is  */
export type UUID = string;
