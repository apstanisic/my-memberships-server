import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Company } from '../companies/company.entity';

@Injectable()
export class CompanyRolesService {
  canAddRole(company: Company, rolesAmount: number): boolean {
    // const rolesAmount = company.roles?.length;

    if (rolesAmount === undefined) throw new InternalServerErrorException();

    if (company.tier === 'free' && rolesAmount >= 5) {
      return false;
    }
    if (company.tier === 'basic' && rolesAmount >= 15) {
      return false;
    }
    if (company.tier === 'pro' && rolesAmount >= 40) {
      return false;
    }
    if (rolesAmount >= 100) {
      return false;
    }
    return true;
  }
}
