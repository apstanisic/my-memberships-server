import { Controller, Post, Put } from '@nestjs/common';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';
import { Tier } from '../company/payment-tiers.list';
import { UUID } from '../core/types';

@Controller('companies/:companyId/pricing-plan')
export class PricingPlanController {
  constructor(private readonly companyService: CompanyService) {}

  /** Change companies tier */
  @Put('')
  async changeTier(companyId: UUID, tier: Tier): Promise<Company> {
    const company = await this.companyService.findOne(companyId);
    return this.companyService.update(company, { tier });
  }
}
