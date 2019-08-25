import { SetMetadata } from '@nestjs/common';

/**
 * This will check if user has provided role.
 * Company owner is not automaticlly company admin.
 * Better to use
 * `@RequiredPermissions(['can_delete', 'can_update'], 'companyId')`
 * @example
 *  @RequireRoles(['admin', 'member'], 'companyId')
 * @deprecated
 */
export function RequiredRoles(roles: string | string[], resourceName?: string) {
  return SetMetadata('required_roles', [roles, resourceName]);
}
