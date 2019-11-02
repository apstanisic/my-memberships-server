import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, DbLogMetadata, RoleService } from 'nestjs-extra';
import { Repository } from 'typeorm';
// import { BaseService } from '../core/base.service';
import { User } from '../user/user.entity';
import { Company } from './company.entity';
// import { RoleService } from '../core/access-control/role.service';
// import { LogMetadata } from '../core/logger/log-metadata';
// import { DbLoggerService } from '../core/logger/db-logger.service';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company) repository: Repository<Company>,
    private readonly roleService: RoleService,
  ) {
    super(repository);
  }

  /** Company can only be deleted if there are not active subscriptions */
  async delete(
    companyOrId: Company | string,
    meta: DbLogMetadata,
  ): Promise<Company> {
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
    return super.delete(company, meta);
  }

  /**
   * Creates new company and owner role.
   * We can't do create(entity, owner) cause of TS limitations.
   * Method must have same signature.
   * More info: https://stackoverflow.com/questions/33542359
   */
  async createCompany(
    entity: Partial<Company>,
    owner: User,
    meta?: DbLogMetadata,
  ): Promise<Company> {
    const company = await this.create({ ...entity, owner });
    await this.roleService.create({
      userId: owner.id,
      name: 'owner',
      domain: company.id,
    });

    if (this.dbLoggerService && meta) {
      const log = this.dbLoggerService!.generateLog({
        meta: { ...meta, domain: company.id },
      });
      await this.dbLoggerService.store(log, 'create', company);
    }
    return company;
  }
}
