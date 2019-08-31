import { ManyToOne, Entity, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { RoleEnum, RoleName } from './roles-permissions/roles.list';
import { DefaultEntity } from '../core/default.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Company } from '../company/company.entity';

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

  @Column()
  userId: string;

  /** Role name */
  @Column()
  name: RoleName;

  /**
   * Domain this role belongs to. In this app domain is company
   * In other domain can be city. Domain limit the reach of user.
   */
  @Column({ default: '*' })
  domain: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
