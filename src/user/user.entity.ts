import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsOptional } from 'class-validator';
import { Field } from 'type-graphql';
import { Subscription } from '../subscription/subscription.entity';
import { BaseUser } from '../core/entities/base-user.entity';
import { Company } from '../company/company.entity';
import { Role } from '../access-control/roles.entity';

/** User Entity */
@Entity('users')
export class User extends BaseUser {
  /** All roles user have */
  @OneToMany(type => Role, role => role.user, { eager: true })
  @Field(type => [Role])
  roles: Role[];

  /* Every subscription user have or had in the past */
  @OneToMany(type => Subscription, subscription => subscription.owner)
  @Field(type => [Subscription])
  subscriptions: Subscription[];

  /** Companies owned by this user */
  @OneToMany(type => Company, company => company.owner)
  @Field(type => [Company])
  companies: Company[];

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @Length(5, 50)
  phoneNumber?: string;
}
