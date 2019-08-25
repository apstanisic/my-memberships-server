import { User } from '../user/user.entity';
import { Role } from './roles.entity';

interface Params {
  user: User;
  resourceId?: string;
  role: Role;
}

/**
 * Check if user has provider role for provided resource
 * @deprecated Don't use this method. Use more granular checkPermissions
 */
export function checkRole({ role, user, resourceId }: Params) {
  if (resourceId !== undefined) {
    const rolesForProvidedResource = user.roles.filter(
      userRole => role === userRole && userRole.resourceId === resourceId
    );
    return rolesForProvidedResource.some(r => r === role);
  }
  return user.roles.some(userRole => userRole === role && !userRole.resourceId);
}
