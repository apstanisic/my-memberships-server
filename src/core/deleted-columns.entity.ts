import { Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * This entity is designed to be embedded
 * It adds time, who deleted it and reason for deletion.
 * This is usefull for resources that need to keep track
 * who deleted them
 */
export class DeletedColumns {
  /** When was entity deleted. */
  @Column({ nullable: true, type: 'date' })
  at?: Date;

  /** User that deleted this entity */
  @ManyToOne((type) => User, { nullable: true })
  by?: string;

  /* Why was entity deleted */
  @Column({ nullable: true })
  reason: string;
}
