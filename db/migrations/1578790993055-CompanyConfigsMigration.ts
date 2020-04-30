import { MigrationInterface, QueryRunner } from 'typeorm';
import { CompanyConfig } from '../../src/company-config/company-config.entity';
import { Company } from '../../src/companies/company.entity';
import { generateCompanyConfig } from '../../src/company-config/company-config.factory';

export class CompanyConfigsMigration1578790993055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const configs: CompanyConfig[] = [];
    const companies = await queryRunner.manager.find(Company);
    companies.forEach(company => {
      configs.push(generateCompanyConfig(company));
    });
    await queryRunner.manager.save(configs);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
