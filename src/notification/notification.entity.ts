import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UUID } from '../core/types';
import { User } from '../user/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @ManyToOne(type => User)
  @Column({ type: 'string' })
  userId: UUID;

  @Column({ precision: 3 })
  seenAt?: Date;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;
}
