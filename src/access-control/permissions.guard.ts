import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/user.entity';
import { stringsToPermissions } from './check-premissions';

/**
 * @returns permissions list that user need to have to access resource
 * @returns Resource id that user wants to access.
 *          If null, user want access to all resources.
 */
type Metadata = [string[], string?];

/**
 * Protect routes from access if user does not have required permissions
 * @example
 *  @RequiredPremissions(['can_delete', 'can_update'], 'resource_id)
 *  @UseGuard(RolesGuard)
 *  method() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /** Check if user can execute function */
  canActivate(context: ExecutionContext): boolean {
    const [metadataPermissions, targetName] = this.reflector.get<Metadata>(
      'required_premissions',
      context.getHandler()
    );

    // If premissions are not passed everyone is allowed
    if (!metadataPermissions) return true;

    const requiredPermissions = stringsToPermissions(metadataPermissions);
    const request = context.switchToHttp().getRequest();
    // Get Id from req object
    const resourceId: string = request.params[targetName as any];
    const user: User = request.user;
    return user.allowedTo(requiredPermissions, resourceId);
  }
}
