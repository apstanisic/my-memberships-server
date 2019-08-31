import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enforcer, newEnforcer } from 'casbin';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles-permissions/roles.list';

interface AddRoleInterface {
  user: User;
  domain: Company;
  roleName: RoleName;
}

@Injectable()
export class AccessControlService {
  enforcer: Enforcer;

  constructor(
    @InjectRepository(User) private readonly repository: Repository<Role>,
  ) {
    newEnforcer('casbin-model.conf', 'casbin-policies.csv').then(enforcer => {
      this.enforcer = enforcer;
    });
  }

  /**
   * For every user role will check if fullfills enforcer requirements
   * @param user User for which roles you want to check
   * @param resourcePath Resource you want to access
   * Can be /company/comp-id or /user/user-id
   * @param action Action you want to perform on resource: read, write...
   */
  async enforce(user: User, resourcePath: string, action: string = 'write') {
    const checks: Promise<boolean>[] = [];
    user.roles.forEach(({ domain }) => {
      checks.push(this.enforcer.enforce(user.id, domain, resourcePath, action));
    });
    const responses = await Promise.all(checks);
    return responses.some(response => response);
  }

  addRole({ user, domain, roleName }: AddRoleInterface) {
    const role = new Role();
    role.user = user;
    role.domain = domain.id;
    role.name = roleName;

    this.repository.save(role);
  }

  async removeRole({ user, domain, roleName }: AddRoleInterface) {
    const role = await this.repository.findOneOrFail({
      where: {
        user,
        domain,
        name: roleName,
      },
    });
    return this.repository.remove(role);
  }
}
