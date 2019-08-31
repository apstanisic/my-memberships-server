import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { Subscription } from '../subscription/subscription.entity';
import { BaseUser } from './base-user.entity';

/** User Entity */
@Entity('users')
@ObjectType({ description: 'User Model' })
export class User extends BaseUser {
  /* Every subscription user have or had in the past */
  @OneToMany(type => Subscription, subscription => subscription.owner)
  @Field(type => [Subscription])
  subscriptions: Subscription[];

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @Field({ nullable: true })
  @Length(5, 50)
  phoneNumber?: string;
}
//
//
//
//
/**
 * //  Companies where this user is owner
 * This is old design. With current role based this is not possible
 * Try something in future
 * @example
 *  @OneToMany(type => Company, company => company.owner)
 *  @Field(type => [Company])
 *  ownedCompanies: Company[];
 *
 *  //  All companies where this user is admin
 *  @ManyToMany(type => Company, company => company.admins)
 *  @Field(type => [Company])
 *  companiesWhereAdmin: Company[];
 *
 */
