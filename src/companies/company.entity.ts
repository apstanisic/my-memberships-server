import { Exclude } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { BaseEntity, Image, Role } from 'nestjs-extra';
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from 'typeorm';
// import { Role } from '../core/access-control/roles.entity';
// import { BaseEntity } from '../core/entities/base.entity';
// import { Image } from '../core/types';
import { Location } from '../locations/location.entity';
import { PaymentRecord } from '../payments/payment-record.entity';
import { PricingPlan } from '../pricing-plans/pricing-plan.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { User } from '../users/user.entity';
import { companiesCategories, CompanyCategory } from './categories.list';
import { availableTiers, Tier } from './payment-tiers.list';
import { CompanyConfig } from '../company-config/company-config.entity';
import { CompanyImage } from '../company-images/company-image.entity';

/**
 * Company can be deleted only if there is no more
 * valid subscriptions
 */
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
  // @RelationId((company: Company) => company.owner)
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
  @Length(4, 3000)
  description: string;

  /** Company's main phone numbers */
  @Column({ type: 'simple-json' })
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
  @OneToMany(
    type => PricingPlan,
    plan => plan.company,
  )
  plans: PricingPlan[];

  /** All company locations */
  @OneToMany(
    type => Location,
    location => location.company,
  )
  locations: Location[];

  // /** All roles this company have. */
  // // Must be both way
  // @OneToMany(
  //   type => Role,
  //   role => role.domain,
  // )
  // roles: Role[];

  /** @TODO Implement this */
  @Column({ default: 'free' })
  @Exclude()
  @IsIn([...availableTiers])
  tier: Tier;

  @OneToMany(
    type => CompanyImage,
    image => image.company,
  )
  images: CompanyImage[];

  @OneToOne(
    type => CompanyConfig,
    config => config.company,
  )
  config: CompanyConfig;

  // All payments for this company
  @OneToMany(
    type => PaymentRecord,
    record => record.company,
  )
  payments: PaymentRecord[];
}
