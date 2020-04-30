import { MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../../src/companies/company.entity';
import { User } from '../../src/users/user.entity';
import { generateSubscription } from '../../src/subscriptions/subscription.factory';
import { Subscription } from '../../src/subscriptions/subscription.entity';

export class SubscriptionMigration1566417766995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const subscriptions: Subscription[] = [];

    const users: User[] = await queryRunner.manager.find(User);

    const companies: Company[] = await queryRunner.manager.find(Company);

    for (let i = 0; i < 15; i += 1) {
      companies.forEach(c => {
        subscriptions.push(generateSubscription(users, [c]));
      });
    }
    await queryRunner.manager.save(subscriptions);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Subscription);
  }
}
