import { Exclude } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { BaseEntity } from 'nestjs-extra';
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CompanyConfig } from '../company-config/company-config.entity';
import { CompanyImage } from '../company-images/company-image.entity';
import { Location } from '../locations/location.entity';
import { PaymentRecord } from '../payments/payment-record.entity';
import { PricingPlan } from '../pricing-plans/pricing-plan.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { User } from '../users/user.entity';
import { companiesCategories, CompanyCategory } from './categories.list';
import { availableTiers, Tier } from './payment-tiers.list';

/** Company */
@Entity('companies')
export class Company extends BaseEntity {
  constructor() {
    super();
    this.credit = this.credit ?? 0;
  }

  /** Company name */
  @Column()
  @Index()
  @IsString()
  @Length(6, 200)
  name: string;

  /** Company owner */
  @ManyToOne(
    type => User,
    owner => owner.companies,
    { onDelete: 'SET NULL' },
  )
  owner: User;

  /** Owner id */
  @Column()
  ownerId: string;

  /** All subscriptions in this company (valid, expired and deleted) */
  @OneToMany(
    type => Subscription,
    subscription => subscription.company,
  )
  subscriptions: Subscription[];

  /** What type of business is this company. Must cloned because of readonly */
  @Column()
  @IsIn([...companiesCategories])
  category: CompanyCategory;

  /** Description of company, it's prices */
  @Column({ type: 'text' })
  @IsString()
  @Length(4, 2000)
  description: string;

  /** Company's main phone numbers */
  @Column({ type: 'jsonb' })
  @IsNotEmpty()
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /** Company's main emails */
  @Column({ type: 'jsonb' })
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  emails: string[];

  /** How many credit company have for buying stuff */
  @Column({ default: 0, type: 'int' })
  @IsOptional()
  @IsInt()
  @Exclude()
  credit: number;

  /** All company locations */
  @OneToMany(
    type => Location,
    location => location.company,
  )
  locations: Location[];

  /** What pricing tier company is using currently */
  @Column({ default: 'free' })
  @Exclude()
  @IsOptional()
  @IsIn([...availableTiers])
  tier: Tier;

  /** Images of company */
  @OneToMany(
    type => CompanyImage,
    image => image.company,
  )
  images: CompanyImage[];

  /** Company config (subscription types...) */
  @OneToOne(
    type => CompanyConfig,
    config => config.company,
  )
  config: CompanyConfig;

  /** All payments in this company for services */
  @OneToMany(
    type => PaymentRecord,
    record => record.company,
  )
  payments: PaymentRecord[];

  /** All plans this company had */
  @OneToMany(
    type => PricingPlan,
    plan => plan.company,
  )
  plans: PricingPlan[];
}
