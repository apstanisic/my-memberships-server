import * as Faker from 'faker';
import { Role } from './roles.entity';
import { availableRoles, RoleEnum } from './roles-permissions/roles.list';
import { User } from '../user/user.entity';
import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();
const user = new User();
ac.grant('user').read('company-id');

const roles = user.roles
  .filter(r => r.resourceId === 'company_id')
  .map(r => r.name);
// ac.can(roles).readOwn('company', 'company-id')

export function generateRole(users: User[]) {
  const random = Faker.random.arrayElement;

  const role = new Role();
  role.resourceId;
  role.user = random(users);
  role.name = random(availableRoles) as RoleEnum;

  return role;
}
