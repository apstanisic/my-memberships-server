import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../src/user/user.entity';
import { Company } from '../../src/company/company.entity';
import companyFactory from '../factories/companyFactory';

export class CompaniesMigration1566417160132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const companies: Company[] = [];
    for (let i = 0; i < 100; i++) {
      companies.push(companyFactory());
    }
    await queryRunner.manager.save(companies);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
