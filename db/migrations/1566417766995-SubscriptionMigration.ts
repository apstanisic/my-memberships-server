import { MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../../src/company/company.entity';
import { User } from '../../src/user/user.entity';
import subscriptionFactory from '../factories/subscriptionFactory';
import { Subscription } from '../../src/subscription/subscription.entity';

export class SubscriptionMigration1566417766995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const subscriptions: Subscription[] = [];
    const users: User[] = await queryRunner.manager.find(User);
    const companies: Company[] = await queryRunner.manager.find(Company);

    for (let i = 0; i < 1500; i++) {
      subscriptions.push(subscriptionFactory(users, companies));
    }
    await queryRunner.manager.save(subscriptions);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
