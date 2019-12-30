import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateCompany } from '../../src/companies/company.factory';
import { Company } from '../../src/companies/company.entity';
import { User } from '../../src/users/user.entity';

export class CompaniesMigration1566417171153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const companies: Company[] = [];
    const users = await queryRunner.manager.find(User);
    for (let i = 0; i < 20; i += 1) {
      companies.push(generateCompany(users));
    }
    await queryRunner.manager.save(companies);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Company);
  }
}
