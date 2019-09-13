import { FindConditions, ObjectLiteral, FindOperator } from 'typeorm';

/** Types that can be passed as TypeOrm where param */
export type OrmWhere<T = any> =
  | FindConditions<T>[]
  | FindConditions<T>
  | ObjectLiteral
  | string
  | undefined;

/** Object that was parsed with parseQuery */
export type ParsedOrmWhere<T = any> = { [key: string]: FindOperator<T> };

/** Regular string, just to make it more clear what type of string it is  */
export type UUID = string;

/** Provided object must have Id and can have any other fields */
export interface WithId {
  id: string;
  [key: string]: any;
}

export type Struct<T = any> = Record<string, T>;

export type ImageMetadata = {
  id: string; // uuid
  position: number; // Zero index
  xs?: string; // 168px
  sm?: string; // 320px
  md?: string; // 640px
  lg?: string; // 1280px
  // xl?: string; // 1920px // curently lg is max
};
