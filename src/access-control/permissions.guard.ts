import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { newEnforcer, Enforcer } from 'casbin';
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
 *  @UseGuard(PremissionGuard)
 *  method() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  /** Casbin enforcer */

  constructor(private readonly reflector: Reflector) {}

  /** Check if user can execute function */
  canActivate(context: ExecutionContext): boolean {
    const enf = newEnforcer();
    const [metadataPermissions, targetName] = this.reflector.get<Metadata>(
      'required_premissions',
      context.getHandler(),
    );

    // If premissions are not passed everyone is allowed
    if (!metadataPermissions) return true;

    const requiredPermissions = stringsToPermissions(metadataPermissions);
    const request = context.switchToHttp().getRequest();
    // Get Id from req object
    const resourceId: string = request.params[targetName as any];
    const { user } = request as { user: User };
    return user.allowedTo(requiredPermissions, resourceId);
  }
}

/**
 *
 * User => resource {path: /company/*/ subscriptoio;
/*}
 *
 *
 *  r =
 *  r = sub, obj, act
 *
 *  allowedTo()
 *  admin, domen231, /comp/$1/data, read
 *  check if
 *  domen 231 === $1 &&      my_func(r.dom, r.obj)   This first
 *  admin can access /comp/$1/data &&   keyMatch2(r.obj, r.path)
 *  can read
 *
 * sub = aleksandar
 * forall
 * admin, comp1
 * admin, comp2
 * comp2 = /comp/comp2
 * myfunc(r.dom, r.obj) && keyMatch2(r.obj, r.path) && r.atr == allow
 *
 *
 *
 *  user.addRole('admin', 'company-Id')
 * user admin /
 *
 */

const s = {
  addRole(role: string, resourceId: string) {},
  check(resourcePath: string[]) {
    resourcePath.some(e => {
      return true;
    });
  },
};

/**
 *
 * @param domain company-id-fs898fdsh
 * @param obj /company/company-id-fjsojfds/subscriptions/fjs9d
 * Check if they belong to same domain
 */
function validDomain(domain: string, resourcePath: string) {
  if (domain === '*') return true;
  return resourcePath.includes(domain);
}
