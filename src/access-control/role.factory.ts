import * as Faker from 'faker';
import { Role } from './roles.entity';
import { availableRoles, RoleEnum } from './roles-permissions/roles.list';
import { User } from '../user/user.entity';

interface HasId {
  id: string;
}

export function generateRole(users: User[], resources: HasId[] = []) {
  const random = Faker.random.arrayElement;

  const role = new Role();
  // role.resourceId;
  role.user = random(users);
  role.name = random(availableRoles) as RoleEnum;
  role.resourceId = random(resources).id;

  return role;
}
