import { MigrationInterface, QueryRunner } from 'typeorm';
import { Arrival } from '../../src/arrivals/arrivals.entity';
import { generateArrival } from '../../src/arrivals/arrival.factory';
import { Company } from '../../src/company/company.entity';

export class ArrivalsMigration1567668491975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const arrivals: Arrival[] = [];
    const companies: Company[] = await queryRunner.manager.find(Company, {
      relations: ['subscriptions', 'locations'],
    });
    generateArrival(companies);

    for (let i = 0; i < 2000; i += 1) {
      arrivals.push(generateArrival(companies));
    }
    await queryRunner.manager.save(arrivals);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Arrival);
  }
}
