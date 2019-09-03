import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { BaseService } from '../core/base.service';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(@InjectRepository(Company) repository: Repository<Company>) {
    super(repository);
  }
}
