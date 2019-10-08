import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

/**
 * Get company. This decorator can only be called after ValidCompanyGuard
 * @example
 *  @UseGuards(CompanyLogsGuard)
 *  someMethod(@GetCompany() company: Company) {}
 */
export const GetCompany = createParamDecorator((data: string, req) => {
  if (!req.company) throw new UnauthorizedException();
  return req.company;
});
