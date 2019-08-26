import { Permission } from './roles-permissions/permissions.list';
import { rolesPremissions as allRoles } from './roles-permissions/roles.list';
import { User } from '../user/user.entity';
import { toArray } from '../core/helpers';

interface Params {
  user: User;
  resourceId?: string;
  permissions: Permission | Permission[];
}

/**
 * Check if user has required premissions to preform on provided resource
 * If resource is not provided, it will check if user has premission to do
 * this on any resource. It will check if resource is provided, if it is
 * it will check if user has premission on given resource, othervise it
 * will check weather user have premission an all resources
 * (table entry will has null as resourceId, this is important, as without it
 * it will return true if user has access to any resource).
 */
export function checkPremissions({
  permissions,
  user,
  resourceId
}: Params): boolean {
  if (!user || !user.roles) return false;
  // If provided premission is string convert to array
  let premissionsArray = toArray(permissions);

  return premissionsArray.every(premission => {
    // If resourceId is provided, only check roles for current resource.
    if (resourceId !== undefined) {
      return canDoToOwnResource(user, premission, resourceId);
    }
    // Othervise check if user has required premission on all resources
    return canDoToAll(user, premission);
  });
}

/**
 * Check if user has any roles with given resource,
 * and then check if provided role can allow provided premission
 */
function canDoToOwnResource(
  user: User,
  premission: Permission,
  resourceId: string
): boolean {
  const rolesForProvidedResource = user.roles.filter(
    role => role.resourceId === resourceId
  );
  // Now that resurceId does not metter, check if provided roles have provided premission
  return rolesForProvidedResource.some(role => {
    return allRoles[role.name].some(
      premissionsForThisRole => premissionsForThisRole === premission
    );
  });
}

/**
 * Check if user has valid premission if resource is not specified
 * In that case resourceId on user object is null
 */
function canDoToAll(user: User, premission: Permission): boolean {
  return user.roles.some(role => {
    return (
      allRoles[role.name].some(
        premissionsForThisRole => premissionsForThisRole === premission
      ) && !role.resourceId
    );
  });
}

/** Convert strings to array of Permission enums */
export function stringsToPermissions(
  permissions: string | string[]
): Permission[] {
  return toArray(permissions).map(per => Permission[per as any] as Permission);
}
