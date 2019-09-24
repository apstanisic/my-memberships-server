import { ActionColumns } from './deleted-columns.entity';

export interface SoftDelete {
  deleted: ActionColumns;
  [key: string]: any;
}
