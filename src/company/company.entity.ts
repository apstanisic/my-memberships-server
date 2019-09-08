import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import {
  IsEmail,
  Length,
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Field } from 'type-graphql';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';
import { BaseEntity } from '../core/entities/base.entity';
import { CompanyCategory, companiesCategories } from './categories.list';
import { Location } from '../locations/location.entity';
import { DeletedColumns } from '../core/entities/deleted-columns.entity';
import { SoftDelete } from '../core/entities/soft-delete.interface';
import { Exclude } from 'class-transformer';

/**
 * Company can be deleted only if there is no more
 * valid subscriptions
 */
@Entity('companies')
export class Company extends BaseEntity implements SoftDelete {
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
  // @RelationId((company: Company) => company.owner)
  @Column()
  @Field()
  ownerId: string;

  /** All subscriptions in this company (valid, expired and deleted) */
  @OneToMany(type => Subscription, subscription => subscription.company)
  @Field(type => [Subscription])
  subscriptions: Subscription[];

  /** What type of business is this company. Must cloned because of readonly */
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

  @Column(type => DeletedColumns)
  @Field(type => DeletedColumns)
  @Exclude()
  deleted: DeletedColumns;

  /** How many credit company have for buying stuff */
  @Column({ default: 0, type: 'int' })
  @IsOptional()
  @IsInt()
  @Exclude()
  credit: number;

  /**
   * All gyms location
   */
  @OneToMany(type => Location, location => location.company, {
    onDelete: 'CASCADE',
  })
  @Field(type => [Location])
  locations: Location[];
}
