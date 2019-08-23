import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Company } from './company.entity';
import parseQuery from '../core/parseQuery';
import { OrmQuery } from '../core/orm-query.pipe';
import { PaginationResult, paginate } from '../core/pagination';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>
  ) {}

  /* Find companies that match criteria */
  find(criteria: any, page?: number) {
    return this.repository.find({ where: parseQuery(criteria) });
  }

  /* Find companies that match criteria with pagination */
  async paginate(
    criteria: OrmQuery = {},
    page: number = 1
  ): Promise<PaginationResult<Company>> {
    return paginate({
      criteria,
      options: { page },
      repository: this.repository
    });
  }

  /* Find company by id */
  findById(id: string): Promise<Company> {
    return this.repository.findOneOrFail(id);
  }

  /* Create new company */
  async save(data: Company): Promise<Company> {
    const company = await this.repository.create(data);
    await company.validate();
    return this.repository.save(company);
  }

  /* Delete company */
  async delete(company: Company): Promise<Company> {
    return this.repository.remove(company);
  }

  /* Update company */
  async update(
    company: Company,
    changedData: DeepPartial<Company>
  ): Promise<Company> {
    this.repository.merge(company, changedData);
    await company.validate();
    return this.repository.save(company);
  }
}
