import { ManyToOne, Entity, Column } from 'typeorm';
import { Field } from 'type-graphql';
import { User } from '../user/user.entity';
import { RoleName } from './roles.list';
import { BaseEntity } from '../core/entities/base.entity';

/**
 * To add admin for company f32 to user
 * @example
 * const role = new Role();
 * role.user = user;
 * role.domain = 'f32';
 * role.name = 'admin';
 * role.description = 'You are admin in company f32. Happy b-day';
 * repo.save(role);
 */
@Entity()
export class Role extends BaseEntity {
  /** User that have this role */
  @ManyToOne(type => User, user => user.roles)
  @Field(type => User)
  user: User;

  /** User's id */
  @Column()
  @Field()
  userId: string;

  /** Role name */
  @Column()
  @Field(type => String)
  name: RoleName;

  /**
   * Domain this role belongs to. In this app domain is company
   * In other domain can be city, or store. Domain limit the reach of user.
   * Keep domain as string so it can be portable and not app specific.
   */
  @Column({ default: '*' })
  @Field()
  domain: string;

  /**
   * Description for this specific role to this user.
   * For example, owner can leave reason why admin have this role
   */
  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  description?: string;
}
