import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, Length, IsString } from 'class-validator';
import { Location } from './location.dto';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';
import { DefaultEntity } from '../core/default.entity';
import { CompanyCategory } from './categories.list';

@Entity('companies')
export class Company extends DefaultEntity {
  /** Company name */
  @Column()
  @IsString()
  @Length(6, 200)
  name: string;

  /** Company owner */
  @ManyToOne(type => User, owner => owner.companies)
  owner: User;

  /** Owner id */
  @Column()
  ownerId: string;

  @OneToMany(type => Subscription, subscription => subscription.company)
  subscriptions: Subscription[];

  /** What type of business is this company */
  @Column({ type: 'string' })
  category: CompanyCategory;

  /** Description of company, it's prices */
  @Column({ type: 'text' })
  @IsString()
  @Length(4, 3000)
  description: string;

  /** Company's main phone number */
  @Column({ type: 'simple-array' })
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /* Company's main email */
  @Column({ type: 'simple-array' })
  @IsEmail({}, { each: true })
  emails: string[];

  /* All gyms location */
  // TODO: This probably causes problems
  @Column({ type: 'simple-json' })
  locations: Location[];
}
