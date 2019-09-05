import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { IsEmail, Length, IsString, IsIn, IsNotEmpty } from 'class-validator';
import { Field } from 'type-graphql';
import { Location } from './location.dto';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';
import { BaseEntity } from '../core/entities/base.entity';
import { CompanyCategory, companiesCategories } from './categories.list';

@Entity('companies')
export class Company extends BaseEntity {
  /** Company name */
  @Column()
  @Index()
  @Field()
  @IsString()
  @Length(6, 200)
  name: string;

  /** Company owner */
  @ManyToOne(type => User, owner => owner.companies)
  @Field(type => User)
  owner: User;

  /** Owner id */
  @Column()
  @Field()
  ownerId: string;

  /** All subscriptions in this company (valid, expired and deleted) */
  @OneToMany(type => Subscription, subscription => subscription.company)
  @Field(type => [Subscription])
  subscriptions: Subscription[];

  /**
   * What type of business is this company
   * Must cloned because of readonly
   * @todo Find fix
   */
  @Column()
  @Field(type => String)
  @IsIn([...companiesCategories])
  category: CompanyCategory;

  /** Description of company, it's prices */
  @Column({ type: 'text' })
  @Field()
  @IsString()
  @Length(4, 3000)
  description: string;

  /** Company's main phone numbers */
  @Column({ type: 'simple-array' })
  @Field(type => [String])
  @IsNotEmpty()
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /** Company's main emails */
  @Column({ type: 'simple-array' })
  @Field(type => [String])
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  emails: string[];

  /**
   * All gyms location
   * @todo Refactor this
   * Maybe move Location to defferent table
   */
  @Column({ type: 'simple-json', nullable: true })
  @Field(type => [Location])
  locations: Location[];
}
