import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../access-control/roles.entity';
import { BaseService } from '../core/base.service';

@Injectable()
export class CompaniesRolesService extends BaseService<Role> {
  constructor(@InjectRepository(Role) readonly repository: Repository<Role>) {
    super(repository);
  }
}
