import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import parseQuery from '../core/parseQuery';
import { paginate, PaginationResponse } from '../core/pagination';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  /** Find companies that match criteria */
  find(criteria: any = {}): Promise<Company[]> {
    return this.repository.find({ where: parseQuery(criteria) });
  }

  /** Find companies that match criteria with pagination */
  async paginate(
    criteria: any = {},
    page: number = 1,
  ): PaginationResponse<Company> {
    return paginate({
      criteria: parseQuery(criteria),
      options: { page },
      repository: this.repository,
    });
  }

  /** Find company by id */
  findOne(id: string): Promise<Company | undefined> {
    return this.repository.findOne(id);
  }

  /** Create new company */
  async save(data: Company): Promise<Company> {
    const company = await this.repository.create(data);
    return this.repository.save(company);
  }

  /** Delete company */
  async delete(company: Company): Promise<Company> {
    return this.repository.remove(company);
  }

  /** Update company */
  async update(company: Company, data: Partial<Company>): Promise<Company> {
    this.repository.merge(company, data);
    await company.validate();
    return this.repository.save(company);
  }
}
