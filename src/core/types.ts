import { FindConditions, ObjectLiteral } from 'typeorm';

/** Types that can be passed as TypeOrm where param */
export type OrmWhere<T = any> =
  | FindConditions<T>[]
  | FindConditions<T>
  | ObjectLiteral
  | string
  | undefined;

/** Regular string, just to make it more clear what type of string it is  */
export type UUID = string;
