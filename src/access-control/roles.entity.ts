import { User } from '../user/user.entity';
import { ManyToOne, Entity, Column } from 'typeorm';
import { RoleEnum } from './roles-permissions/roles.list';
import { DefaultEntity } from '../core/default.entity';

@Entity()
export class Role extends DefaultEntity {
  /** Role name */
  @Column()
  name: RoleEnum;

  /** User that have this role */
  @ManyToOne(type => User, user => user.roles)
  user: User;

  /** Id of resource user have access with this role */
  @Column({ nullable: true })
  resourceId?: string;

  @Column()
  resourceType: string;

  // @Column()
  // description?: string;

  /**
   * @TODO User can be specificly
   * forbidden from certain feature.
   * For example, He is currently banned, but
   * will be allowed in the future again.
   * @example
   *  @Column({default: true})
   * allowed: boolean;
   */
}
