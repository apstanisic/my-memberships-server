import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import {
  IsEmail, MinLength, ValidateNested, validate,
} from 'class-validator';
import { Exclude, classToClass } from 'class-transformer';
import { ObjectType, Field, ID } from 'type-graphql';
import { Location } from './location.dto';
import { User } from '../user/user.entity';
import BaseException from '../core/BaseException';
import { Subscription } from '../subscription/subscription.entity';
import { DefaultEntity } from '../core/default.entity';

@Entity('companies')
@ObjectType({ description: 'Company Model' })
export class Company extends DefaultEntity {
  /* Company name */
  @Column()
  @Field()
  @MinLength(6)
  name: string;

  /* Company owner */
  @ManyToOne((type) => User)
  @Field((type) => User)
  owner: User;

  // /* Owner id */
  // @Column()
  // ownerId: string;

  /* Company admins */
  // @ManyToMany(type => User, user => user.companiesWhereAdmin)
  // @ManyToOne(type =>)
  // @JoinTable()
  // @Field(type => [User])
  // @ValidateNested()
  // admins: User[];

  @OneToMany((type) => Subscription, (subscription) => subscription.company)
  @Field((type) => [Subscription])
  subscriptions: Subscription[];

  /** Description of company, it's prices */
  @Column()
  description: string;

  /* Company's main phone number */
  @Column({ type: 'simple-array' })
  @Field((type) => [String])
  @MinLength(8, { each: true })
  phoneNumbers: string[];

  /* Company's main email */
  @Column({ type: 'simple-array' })
  @Field((type) => [String])
  @IsEmail({}, { each: true })
  emails: string[];

  /* All gyms location */
  // TODO: This probably causes problems
  @Column({ type: 'simple-json' })
  @Field((type) => [Location])
  locations: Location[];
}
