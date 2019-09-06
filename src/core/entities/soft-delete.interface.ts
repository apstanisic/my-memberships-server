import { DeletedColumns } from './deleted-columns.entity';

export interface SoftDelete {
  deleted: DeletedColumns;
  [key: string]: any;
}
