import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly companyService: CompanyService) {}

  /** Add credit to company */
  async addCredit(
    company: Company,
    amount: number,
    user: User,
  ): Promise<number> {
    const newCredit = company.credit + amount;
    await this.companyService.update(
      company,
      { credit: newCredit },
      { user, reason: 'Sub credit' },
    );
    return company.credit;
  }

  /** Substract credit from company */
  async substractCredit(
    company: Company,
    amount: number,
    user: User,
  ): Promise<number> {
    const newCredit = company.credit - amount;
    await this.companyService.update(
      company,
      { credit: newCredit },
      { user, reason: 'Sub credit' },
    );
    return company.credit;
  }

  /** Set credit for company */
  async setCredit(
    company: Company,
    amount: number,
    user: User,
  ): Promise<number> {
    await this.companyService.update(
      company,
      { credit: amount },
      { user, reason: 'Set credit' },
    );
    return company.credit;
  }
}
