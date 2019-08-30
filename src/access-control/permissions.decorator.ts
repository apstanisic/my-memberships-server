import { SetMetadata } from '@nestjs/common';
import { castArray } from 'lodash';

/**
 * Decorator that set metadata. It set requires permissions for given
 * resource. If resource is not provided then requires for all resources
 * @example
 *  @RequiredPremissions(['can_delete', 'can_read'], 'companyId')
 *  method() {}
 */
export function RequiredPremissions(
  permissions: string | string[],
  targetName?: string,
) {
  const permissionsArray = castArray(permissions);
  return SetMetadata('required_premissions', [permissionsArray, targetName]);
}
