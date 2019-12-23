import { IsOptional, Length } from 'class-validator';
import { BaseUserWithRoles } from 'nestjs-extra';
import { Column, Entity, OneToMany } from 'typeorm';
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

  /** Only subscription ids */
  // @RelationId((user: User) => user.subscriptions)
  subscriptionIds: string[];

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
