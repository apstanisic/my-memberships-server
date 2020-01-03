import { IsOptional, Length } from 'class-validator';
import { BaseUserWithRoles, Notification, Role } from 'nestjs-extra';
import { Column, Entity, OneToMany } from 'typeorm';
import { Arrival } from '../arrivals/arrival.entity';
import { Company } from '../companies/company.entity';
import { Subscription } from '../subscriptions/subscription.entity';

/** User Entity */
@Entity('users')
export class User extends BaseUserWithRoles {
  /* Every subscription user have or had in the past */
  @OneToMany(
    type => Subscription,
    subscription => subscription.owner,
  )
  subscriptions: Subscription[];

  @OneToMany(
    type => Role,
    role => role.user,
  )
  roles: Role[];

  @OneToMany(
    type => Notification,
    notification => notification.user,
  )
  notifications: Notification[];

  /** Companies owned by this user */
  @OneToMany(
    type => Company,
    company => company.owner,
  )
  companies: Company[];

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @IsOptional()
  @Length(5, 50)
  phoneNumber?: string;

  @OneToMany(
    type => Arrival,
    arrival => arrival.user,
  )
  arrivals: Arrival[];
}
