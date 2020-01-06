import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';

/** Check if param for company is provided, get that company, or throw */
@Injectable()
export class CompanyLogsGuard implements CanActivate {
  constructor(private readonly companyService: CompaniesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req || !req.params || !req.params.companyId) {
      throw new BadRequestException();
    }
    const company = await this.companyService.findOne(req.params.companyId);
    if (company.tier !== 'pro' && company.tier !== 'enterprise') return false;
    req.company = company;
    return true;
  }
}
