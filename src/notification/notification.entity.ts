import { Column, ManyToOne, Entity } from 'typeorm';
import { BaseEntity } from '../core/entities/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(type => User)
  user: User;

  @Column({ precision: 3 })
  seenAt?: Date;
}
