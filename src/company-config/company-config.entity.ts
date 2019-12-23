import { BaseEntity } from 'typeorm';

export class CompanyConfig extends BaseEntity {
  companyId: string;
  key: string;
  value: string;
}
