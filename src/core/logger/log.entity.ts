import {
  Entity,
  Column,
  Index,
  ObjectID,
  ObjectIdColumn,
  BeforeInsert,
} from 'typeorm';
import { classToClass } from 'class-transformer';
import { UUID, WithId } from '../types';
import { NoRelActionColumns } from '../entities/deleted-columns.entity';

/**
 * This entity is using MongoDb. TypeOrm currently supports only this NoSql db.
 * It's better then to store in Sql.
 * "before" and "after" don't need to be converted to json.
 */
@Entity()
export class Log<T extends WithId = any> {
  @ObjectIdColumn()
  _id: ObjectID;

  /** Old entity value. Just created will have no before value. */
  @Column({ nullable: true })
  before?: T;

  /** New entity value. If object is deleted it will not have after value */
  @Column({ nullable: true })
  after?: T;

  /** What action was executed (delete, update, custom-action) */
  @Column({ type: 'string' })
  action: 'update' | 'delete' | 'create' | string;

  /** Standard deleted columns */
  @Column(type => NoRelActionColumns)
  executed: NoRelActionColumns;

  @Column('string')
  @Index()
  entityId: UUID;

  /** Remove sensitive data from entities. */
  @BeforeInsert()
  removeSensitiveData(): void {
    this.before = classToClass(this.before);
    this.after = classToClass(this.after);
    this.executed.by = classToClass(this.executed.by);
  }
}
