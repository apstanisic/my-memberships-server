import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateCompany } from '../../src/company/company.factory';
import { Company } from '../../src/company/company.entity';
import { User } from '../../src/user/user.entity';

export class CompaniesMigration1566417171153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const companies: Company[] = [];
    const users = await queryRunner.manager.find(User);
    for (let i = 0; i < 100; i++) {
      companies.push(generateCompany(users));
    }
    await queryRunner.manager.save(companies);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
