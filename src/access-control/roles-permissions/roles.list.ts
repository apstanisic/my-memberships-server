import { Permission } from './permissions.list';

/**
 * This file contains every role that this app have
 */

/* What guest can do */
const guest: Permission[] = [];

/* What user can do */
const user: Permission[] = guest.concat([
  Permission['cancel_subscription:own'],
  Permission['request_subscription:own'],
  Permission['create_company:any']
]);

/* What company admin can do */
const companyAdmin: Permission[] = user.concat([
  Permission['read_company_subscribers:own'],
  Permission['add_member_subscription:own'],
  Permission['remove_member_subscription:own'],
  Permission['approve_subscription:own'],
  Permission['ban_member:own'],
  Permission['unban_member:own']
]);

/* What company owner can do */
const companyOwner: Permission[] = companyAdmin.concat([
  Permission['update_company:own'],
  Permission['delete_company:own'],
  Permission['change_company_owner:own'],
  Permission['add_company_admin:own'],
  Permission['remove_company_admin:own']
]);

/* What app admin can do */
const appAdmin: Permission[] = user.concat([
  Permission['delete_company:any'],
  Permission['delete_user:any'],
  Permission['change_company_owner:any']
]);

/* What app owner can do */
const appOwner: Permission[] = appAdmin.concat([
  Permission['add_app_admin:any'],
  Permission['remove_app_admin:any']
]);

export enum RoleEnum {
  guest = 'guest',
  user = 'user',
  companyAdmin = 'company_admin',
  companyOwner = 'company_owner',
  appAdmin = 'app_admin',
  appOwner = 'app_owner'
}

export const rolesPremissions: Record<RoleEnum, Permission[]> = {
  user,
  guest,
  app_admin: appAdmin,
  app_owner: appOwner,
  company_owner: companyOwner,
  company_admin: companyAdmin
};
