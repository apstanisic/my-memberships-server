import { Permission } from './permissions.list';
export enum RoleEnum {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
  owner = 'owner',
  appAdmin = 'app_admin',
  appOwner = 'app_owner',
}

export const availableRoles = [
  'guest',
  'user',
  'company_admin',
  'company_owner',
  'app_admin',
  'app_owner',
];

export type RoleName =
  | 'guest'
  | 'user'
  | 'admin'
  | 'owner'
  | 'app_admin'
  | 'app_owner';
