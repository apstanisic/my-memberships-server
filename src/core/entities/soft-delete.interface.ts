import { DeleteColumns } from './deleted-columns.entity';

export interface SoftDelete {
  deleted: DeleteColumns;
  [key: string]: any;
}
