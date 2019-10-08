import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CompanyService } from './company.service';

/** Check if param for company is provided, get that company, or throw */
@Injectable()
export class ValidCompanyGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req || !req.params || !req.params.companyId) {
      throw new BadRequestException();
    }
    if (req && req.params && req.params.companyId) {
      const company = await this.companyService.findOne(req.params.companyId);
      req.company = company;
      return true;
    }

    return false;
  }
}
