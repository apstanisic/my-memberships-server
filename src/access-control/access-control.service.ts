import { Injectable } from '@nestjs/common';
import { Enforcer, newEnforcer, StringAdapter } from 'casbin';
import { User } from '../user/user.entity';
import { casbinValidDomain } from './casbin/custom-matchers';
import { casbinPolicies } from './casbin/casbin-policies';
import { casbinModel } from './casbin/casbin-model';

@Injectable()
export class AccessControlService {
  enforcer: Enforcer;

  constructor() {
    const stringAdapter = new StringAdapter(casbinPolicies);

    newEnforcer(casbinModel, stringAdapter).then(enforcer => {
      this.enforcer = enforcer;
      this.enforcer.addFunction('validDomain', casbinValidDomain);
    });
  }

  /**
   * For every user role will check if fullfills enforcer requirements
   * @param user User for which roles you want to check
   * @param resourcePath Resource you want to access
   * Can be /company/comp-id or /user/user-id
   * @param action Action you want to perform on resource: read, write...
   */
  async isAllowed(
    user: User,
    resourcePath: string,
    action: string = 'write',
  ): Promise<boolean> {
    const checks: Promise<boolean>[] = [];
    user.roles.forEach(role => {
      checks.push(
        this.enforcer.enforce(role.name, role.domain, resourcePath, action),
      );
    });
    const responses = await Promise.all(checks);

    return responses.some(response => response);
  }
}
