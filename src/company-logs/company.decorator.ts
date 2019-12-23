import {
  createParamDecorator,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Company } from '../companies/company.entity';

/**
 * Get company. This decorator can only be called after ValidCompanyGuard
 * @example
 *  @UseGuards(CompanyLogsGuard)
 *  someMethod(@GetCompany() company: Company) {}
 */
export const GetCompany = createParamDecorator((data: string, req) => {
  if (!req.company) throw new UnauthorizedException();
  if ((req.company as Company).tier === 'banned') {
    throw new ForbiddenException('You are banned');
  }
  return req.company;
});
