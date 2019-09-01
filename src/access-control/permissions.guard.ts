import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/user.entity';
import { AccessControlService } from './access-control.service';

/**
 * @returns permissions list that user need to have to access resource
 * @returns Resource id that user wants to access.
 *          If null, user want access to all resources.
 */
type Metadata = [boolean?, string?, string?];

/**
 * Protect routes from access if user does not have required permissions
 * @example
 *  @RequiredPremissions(['can_delete', 'can_update'], 'resource_id)
 *  @UseGuard(PremissionGuard)
 *  method() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  /** Casbin enforcer */

  constructor(
    private readonly reflector: Reflector,
    private readonly acService: AccessControlService,
  ) {}

  /** Check if user can execute function */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const [metadataPermissions, targetName] = this.reflector.get<Metadata>(
    //   'required_premissions',
    //   context.getHandler(),
    // );
    const [execute, action, resourcePath] = this.reflector.get<Metadata>(
      'access_control',
      context.getHandler(),
    );
    if (!execute) return true;
    // @IsAllowed('read')

    // If premissions are not passed everyone is allowed
    // if (!metadataPermissions) return true;

    // const requiredPermissions = stringsToPermissions(metadataPermissions);
    const request = context.switchToHttp().getRequest();
    // Get Id from req object
    // const resourceId: string = request.params[targetName as any];
    const { user } = request as { user: User };
    // return user.allowedTo(requiredPermissions, resourceId);
    const allowed = await this.acService.isAllowed(
      user,
      resourcePath || request.path,
      action || 'write',
    );
    return allowed;
  }
}
