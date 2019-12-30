import { IsOptional, Length } from 'class-validator';
import { BaseUserWithRoles, Role, Notification } from 'nestjs-extra';
import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
// import { BaseUser } from '../core/entities/base-user.entity';
import { Company } from '../companies/company.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Arrival } from '../arrivals/arrival.entity';
// import { Role } from '../core/access-control/roles.entity';

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
