import { ManyToOne, Entity, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { RoleName } from './roles.list';
import { DefaultEntity } from '../core/default.entity';

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
export class Role extends DefaultEntity {
  /** User that have this role */
  @ManyToOne(type => User, user => user.roles)
  user: User;

  /** User's id */
  @Column()
  userId: string;

  /** Role name */
  @Column()
  name: RoleName;

  /**
   * Domain this role belongs to. In this app domain is company
   * In other domain can be city, or store. Domain limit the reach of user.
   * Keep domain as string so it can be portable and not app specific.
   */
  @Column({ default: '*' })
  domain: string;

  /**
   * Description for this specific role to this user.
   * For example, owner can leave reason why admin have this role
   */
  @Column({ type: 'text', nullable: true })
  description?: string;
}
