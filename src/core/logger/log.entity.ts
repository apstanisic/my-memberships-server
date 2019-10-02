import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn,
  BeforeInsert,
} from 'typeorm';
import { classToClass, plainToClass, Exclude } from 'class-transformer';
import { diff } from 'deep-diff';
import * as Faker from 'faker';
import { UUID, WithId } from '../types';
import { IUser, BasicUserInfo } from '../entities/user.interface';

/**
 * This entity is using MongoDb. TypeOrm currently supports only this NoSql db.
 * It's better then to store in Sql.
 */
@Entity()
export class Log<T extends WithId = any> {
  /** Default mongo id */
  @ObjectIdColumn()
  @Exclude()
  _id: ObjectID;

  /** Id for public use */
  @Column({ default: Faker.random.uuid(), type: 'string' })
  id: UUID;

  /** What action was executed (delete, update, custom-action) */
  @Column({ type: 'string', default: 'update' })
  action: 'update' | 'delete' | 'create' | string;

  /** Why is this action executed. */
  @Column({ nullable: true })
  reason?: string;

  /** Who executed this action */
  @Column(type => BasicUserInfo)
  executedBy: BasicUserInfo | IUser;

  /** At what time was this action executed. */
  @Column({ precision: 3, default: new Date() })
  readonly executedAt: Date;

  /** Value before changes. For creating it will be null. Don't set directly. */
  @Column({ nullable: true })
  initialValue?: T;

  /** Diff of changes. */
  @Column()
  changes: any;

  /**
   * entityId is used for easier filtering of results.
   * If action is create, use id after creating.
   * It can be filtered directly on entity, but this way it's
   * easier to migrate no Sql db or log to file.
   */
  @Column('string')
  entityId: UUID;

  /**
   * Id of domain this log belongs to.
   * It can be company, web store, school, group.
   * Useful for finding many logs. Example: all changes in this store.
   */
  @Column({ type: 'string', nullable: true })
  domainId?: UUID;

  /** This will generate difference between new and old values. */
  set newValue(newValue: T | undefined) {
    this.changes = diff(this.initialValue, newValue);
    if (!this.entityId && newValue && newValue.id) {
      this.entityId = newValue.id;
    }
  }

  /** Remove unnecesary data from user. */
  @BeforeInsert()
  _prepare(): void {
    this.executedBy = plainToClass(BasicUserInfo, this.executedBy);
    // Remove excluded properties, and set entity id
    this.initialValue = classToClass(this.initialValue);
    if (this.initialValue && this.initialValue.id) {
      this.entityId = this.initialValue.id;
    }
  }
}
