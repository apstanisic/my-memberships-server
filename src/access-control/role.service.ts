import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles.list';
import { BaseService } from '../core/base.service';
import { DeleteRoleDto } from './roles.dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(@InjectRepository(Role) repository: Repository<Role>) {
    super(repository);
  }

  /** Remove role from user. Returns deleted role */
  async removeRole(where: DeleteRoleDto): Promise<Role> {
    const role = await this.repository.findOneOrFail({ where });
    return this.repository.remove(role);
  }
}
