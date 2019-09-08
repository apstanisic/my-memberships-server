import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from './roles.entity';
import { Company } from '../company/company.entity';
import { RoleName } from './roles.list';
import { BaseService } from '../core/base.service';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(@InjectRepository(Role) repository: Repository<Role>) {
    super(repository);
  }
}
