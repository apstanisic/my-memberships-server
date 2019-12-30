import { MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../../src/companies/company.entity';
import { Location } from '../../src/locations/location.entity';
import { generateLocation } from '../../src/locations/location.factory';

export class LocationsMigration1567668491971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const locations: Location[] = [];
    const companies: Company[] = await queryRunner.manager.find(Company);

    for (let i = 0; i < 3; i += 1) {
      companies.forEach(company => locations.push(generateLocation([company])));
    }

    await queryRunner.manager.save(locations);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Location);
  }
}
