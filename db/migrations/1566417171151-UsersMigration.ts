import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { generateUser } from '../../src/users/user.factory';

export class UsersMigration1566417171151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const users: User[] = [];
    for (let i = 0; i < 20; i += 1) {
      users.push(generateUser());
    }
    await queryRunner.manager.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(User);
  }
}
