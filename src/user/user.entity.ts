import { Entity, Column, OneToMany } from 'typeorm';
import { Length } from 'class-validator';
import { Subscription } from '../subscription/subscription.entity';
import { BaseUser } from './base-user.entity';
import { Company } from '../company/company.entity';

/** User Entity */
@Entity('users')
export class User extends BaseUser {
  /* Every subscription user have or had in the past */
  @OneToMany(type => Subscription, subscription => subscription.owner)
  subscriptions: Subscription[];

  /** Companies owned by this user */
  @OneToMany(type => Company, company => company.owner)
  companies: Company[];

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @Length(5, 50)
  phoneNumber?: string;
}
