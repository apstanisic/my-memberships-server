import { Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

export class DeletedColumns {
  /** When was entity deleted. */
  @Column({ nullable: true, type: 'date' })
  at?: Date;

  /** User that deleted this entity */
  @ManyToOne(type => User, { nullable: true })
  by?: string;

  /* Why was entity deleted */
  @Column({ nullable: true })
  reason: string;
}
