import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles.list';

interface ChangeRoleDto {
  user: User;
  domain: Company;
  roleName: RoleName;
  description?: string;
}

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {}

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
