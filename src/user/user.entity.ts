import { Exclude } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';
import { BaseUser, IUser, Role, BaseUserWithRoles } from 'nestjs-extra';
import { Column, Entity, OneToMany } from 'typeorm';
// import { BaseUser } from '../core/entities/base-user.entity';
import { Company } from '../company/company.entity';
import { Subscription } from '../subscription/subscription.entity';
// import { Role } from '../core/access-control/roles.entity';

/** User Entity */
@Entity('users')
export class User extends BaseUserWithRoles {
  /** All roles user have */
  // @OneToMany(type => Role, role => role.user, { eager: true })
  // @Exclude()
  // roles: Role[];

  /* Every subscription user have or had in the past */
  @OneToMany(type => Subscription, subscription => subscription.owner)
  subscriptions: Subscription[];

  /** Only subscription ids */
  // @RelationId((user: User) => user.subscriptions)
  subscriptionIds: string[];

  /** Companies owned by this user */
  @OneToMany(type => Company, company => company.owner)
  companies: Company[];

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @IsOptional()
  @Length(5, 50)
  phoneNumber?: string;
}
