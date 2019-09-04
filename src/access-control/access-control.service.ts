import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enforcer, newEnforcer, StringAdapter } from 'casbin';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles.list';
import { casbinValidDomain } from './casbin/custom-matchers';
import { casbinPolicies } from './casbin/casbin-policies';
import { casbinModel } from './casbin/casbin-model';

interface ChangeRoleDto {
  user: User;
  domain: Company;
  roleName: RoleName;
  description?: string;
}

@Injectable()
export class AccessControlService {
  enforcer: Enforcer;

  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {
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
    user.roles.forEach(({ domain }) => {
      checks.push(this.enforcer.enforce(user.id, domain, resourcePath, action));
    });
    const responses = await Promise.all(checks);
    return responses.some(response => response);
  }

  /** Add role to user */
  addRole({
    user,
    domain,
    roleName,
    description,
  }: ChangeRoleDto): Promise<Role> {
    const role = new Role();
    role.user = user;
    role.domain = domain.id;
    role.name = roleName;
    if (description) role.description = description;

    return this.repository.save(role);
  }

  /** Remove role from user. Returns deleted role */
  async removeRole({ user, domain, roleName }: ChangeRoleDto): Promise<Role> {
    const role = await this.repository.findOneOrFail({
      where: { user, domain, name: roleName },
    });
    return this.repository.remove(role);
  }
}
