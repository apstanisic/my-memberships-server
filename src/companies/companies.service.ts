import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseService,
  DbLogMetadata,
  NotificationService,
  RoleService,
} from 'nestjs-extra';
import { Repository } from 'typeorm';
import { CompanyConfigService } from '../company-config/company-config.service';
import { User } from '../users/user.entity';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company) repository: Repository<Company>,
    private readonly roleService: RoleService,
    private readonly notificationService: NotificationService,
    private readonly companyConfigService: CompanyConfigService,
  ) {
    super(repository);
  }

  /** Delete company and notify everyone that had subscription */
  async deleteCompany(
    companyOrId: Company | string,
    meta: DbLogMetadata,
  ): Promise<Company> {
    let company: Company;
    if (typeof companyOrId === 'string') {
      company = await this.findOne(companyOrId, {
        relations: ['subscriptions'],
      });
    } else {
      company = companyOrId;
    }

    const deletionNotification = company.subscriptions
      ?.filter(sub => sub.active)
      .map(sub =>
        this.notificationService.addNotification({
          title: `Company ${company.name} has been deleted.`,
          userId: sub.ownerId,
        }),
      );

    await Promise.all(deletionNotification);
    await this.companyConfigService.delete(company.id);
    await this.roleService.getRepository().delete({ domain: company.id });
    return this.delete(company, meta);
  }

  /**
   * Creates new company and owner role.
   * We can't do create(entity, owner) cause of TS limitations.
   * Method must have same signature.
   * More info: https://stackoverflow.com/questions/33542359
   */
  async createCompany(
    companyData: Partial<Company>,
    owner: User,
    meta?: DbLogMetadata,
  ): Promise<Company> {
    const company = await this.create({ ...companyData, owner }, meta);

    if (meta) meta.domain = company.id;

    await this.roleService.create(
      {
        userId: owner.id,
        name: 'owner',
        domain: company.id,
      },
      meta,
    );
    await this.companyConfigService.create({
      company,
      version: 1,
      config: {},
    });

    return company;
  }
}
