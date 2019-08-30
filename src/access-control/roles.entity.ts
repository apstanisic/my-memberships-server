import { ManyToOne, Entity, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { RoleEnum } from './roles-permissions/roles.list';
import { DefaultEntity } from '../core/default.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Company } from '../company/company.entity';

@Entity()
export class Role extends DefaultEntity {
  /** Role name */
  @Column()
  name: RoleEnum;

  /** User that have this role */
  @ManyToOne((type) => User, (user) => user.roles)
  user: User;

  /** Id of resource user have access with this role */
  /** @todo This should be companyId ??????? */
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

/**
 *
 *
 * admin: company/cf23j98f2j3/subscriptions/*:read
 * admin: company/cf23j98f2j3/subscriptions/*:update
 * admin: company/cf23j98f2j3/subscriptions/*:delete
 *
 *
 * user: company/cf23j98f2j3/subscriptions/fjdsaiofsda:delete
 * user: company/cf23j98f2j3/subscriptions/fjdsaiofsda:delete
 *
 *
 *
 */

function convertTopremission() {
  const sub = new Subscription();
  return `company/${sub.companyId}/subscription/${sub.id}`;
}

function compTOper() {
  const com = new Company();
  return `company/${com.id}`;
}
const supad = '*';
const comAd = 'company/fdsafdsa/subscription/*';

// const adminRoles = `company/${comAd.id}/`
/**
 *
 *
 *
 *
 * Role
 * policy id,
 * user
 * resource
 * accessType
 *
 */
