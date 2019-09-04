import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles.list';
import { BaseService } from '../core/base.service';

interface ChangeRoleDto {
  user: User;
  domain: Company;
  roleName: RoleName;
  description?: string;
}

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(@InjectRepository(Role) repository: Repository<Role>) {
    super(repository);
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
    return this.create(role);
  }

  /** Remove role from user. Returns deleted role */
  async removeRole({ user, domain, roleName }: ChangeRoleDto): Promise<Role> {
    const role = await this.repository.findOneOrFail({
      where: { user, domain, name: roleName },
    });
    const roll = this.findOne({ user, domain, name: roleName });
    return this.repository.remove(role);
  }
}
