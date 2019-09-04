import { FindConditions, ObjectLiteral } from 'typeorm';

export type OrmWhere<T = any> =
  | FindConditions<T>[]
  | FindConditions<T>
  | ObjectLiteral
  | string
  | undefined;
