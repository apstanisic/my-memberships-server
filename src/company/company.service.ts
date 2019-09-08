import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Company } from './company.entity';
import { BaseService } from '../core/base.service';
import { User } from '../user/user.entity';
import { RoleService } from '../access-control/role.service';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company) repository: Repository<Company>,
    private readonly roleService: RoleService,
  ) {
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

  /**
   * Creates new company and owner role.
   * We can do create(entity, owner) cause of TS limitations.
   * More info: https://stackoverflow.com/questions/33542359
   */
  async createCompany(
    entity: DeepPartial<Company>,
    owner: User,
  ): Promise<Company> {
    const company = await this.create({ ...entity, owner });
    await this.roleService.create({
      user: owner,
      name: 'owner',
      domain: company.id,
    });
    return company;
  }
}
