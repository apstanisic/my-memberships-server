import { Company } from 'src/companies/company.entity';
import { CompanyConfig } from './company-config.entity';

/** Generate company config */
export function generateCompanyConfig(company: Company): CompanyConfig {
  const config = new CompanyConfig();
  config.company = company;
  config.version = 1;

  return config;
}
