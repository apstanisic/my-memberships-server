import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import {
  IsEmail,
  Length,
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsInt,
  ArrayMaxSize,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';
import { BaseEntity } from '../core/entities/base.entity';
import { CompanyCategory, companiesCategories } from './categories.list';
import { Location } from '../locations/location.entity';
import { DeleteColumns } from '../core/entities/deleted-columns.entity';
import { SoftDelete } from '../core/entities/soft-delete.interface';
import { PricingPlan } from '../pricing-plan/pricing-plan.entity';
import { ImageMetadata } from '../core/types';

/**
 * Company can be deleted only if there is no more
 * valid subscriptions
 */
@Entity('companies')
export class Company extends BaseEntity {
  /** Company name */
  @Column()
  @Index()
  @IsString()
  @Length(6, 200)
  name: string;

  /** Company owner */
  @ManyToOne(type => User, owner => owner.companies)
  owner: User;

  /** Owner id */
  // @RelationId((company: Company) => company.owner)
  @Column()
  ownerId: string;

  /** All subscriptions in this company (valid, expired and deleted) */
  @OneToMany(type => Subscription, subscription => subscription.company)
  subscriptions: Subscription[];

  /** What type of business is this company. Must cloned because of readonly */
  @Column()
  @IsIn([...companiesCategories])
  category: CompanyCategory;

  /** Description of company, it's prices */
  @Column({ type: 'text' })
  @IsString()
  @Length(4, 3000)
  description: string;

  /** Company's main phone numbers */
  @Column({ type: 'simple-array' })
  @IsNotEmpty()
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /** Company's main emails */
  @Column({ type: 'simple-array' })
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  emails: string[];

  /** How many credit company have for buying stuff */
  @Column({ default: 0, type: 'int' })
  @IsOptional()
  @IsInt()
  @Exclude()
  credit: number;

  /** On which pricing plan is company */
  @OneToMany(type => PricingPlan, plan => plan.company)
  plans: PricingPlan[];

  /** All company locations */
  @OneToMany(type => Location, location => location.company, {
    onDelete: 'CASCADE',
  })
  locations: Location[];

  /** Path to images of company. Currently 5 images max */
  @Column({ type: 'simple-json', default: [] })
  @IsString({ each: true })
  @ArrayMaxSize(5)
  images: ImageMetadata[];
}
