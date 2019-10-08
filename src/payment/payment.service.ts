import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { UUID } from '../core/types';
import { User } from '../user/user.entity';
import { Tier, Company } from '../company/company.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly companyService: CompanyService) {}

  /** Add or substract credit from company */
  async changeCredit(
    companyId: UUID,
    amount: number,
    user: User,
  ): Promise<number> {
    const company = await this.companyService.findOne(companyId);
    const newCredit = company.credit + amount;
    await this.companyService.update(
      company,
      { credit: newCredit },
      { user, reason: 'Change credit' },
    );
    return company.credit;
  }

  /** Set credit for company */
  async replaceCredit(
    companyId: UUID,
    amount: number,
    user: User,
  ): Promise<number> {
    const company = await this.companyService.findOne(companyId);
    await this.companyService.update(
      company,
      { credit: amount },
      { user, reason: 'Set credit' },
    );
    return company.credit;
  }

  /** Change companies tier */
  async changeTier(companyId: UUID, tier: Tier): Promise<Company> {
    const company = await this.companyService.findOne(companyId);
    return this.companyService.update(company, { tier });
  }
}
