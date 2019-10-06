import { Column, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';
import { BasicUserInfo } from './user.interface';

/**
 * This entity is designed to be embedded
 * It adds time, who deleted it and reason for deletion.
 * This is usefull for resources that need to keep track
 * who deleted them. User might be embeded or relational
 */
class WithoutUserActionColumns {
  /** When was entity deleted. */
  @Column({ nullable: true, type: 'timestamp', precision: 3 })
  at?: Date;

  /** User's id */
  @Column()
  byId?: string;

  /* Why was entity deleted */
  @Column({ nullable: true })
  reason?: string;
}

/**
 * Default action columns with relations to user table
 */
export class DeleteColumns extends WithoutUserActionColumns {
  /** User that deleted this entity */
  @ManyToOne(type => User, { nullable: true })
  by?: User;
}

/**
 * Action columns without relations
 */
export class NoRelActionColumns extends WithoutUserActionColumns {
  @Column(type => User)
  by?: BasicUserInfo;
}
