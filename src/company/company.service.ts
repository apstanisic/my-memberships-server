import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { BaseService } from '../core/base.service';
import { User } from '../user/user.entity';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(@InjectRepository(Company) repository: Repository<Company>) {
    super(repository);
  }

  /** Company can only be deleted if there are not active subscriptions */
  async delete(companyOrId: Company | string, user: User): Promise<Company> {
    let company;
    if (typeof companyOrId === 'string') {
      company = await this.findOne(companyOrId, {
        relations: ['subscriptions'],
      });
    } else {
      company = companyOrId;
    }
    if (company.subscriptions.some(sub => sub.isValid())) {
      throw new ForbiddenException('You still have valid subscriptions.');
    }
    // return this.repository.remove(company);
    return super.delete(company, user);
  }
}
