import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../src/access-control/roles.entity';
import { User } from '../../src/user/user.entity';
import { Company } from '../../src/company/company.entity';
import { generateRole } from '../../src/access-control/role.factory';

export class RolesMigration1566763274976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let roles: Role[];

    const users: User[] = await queryRunner.manager.find(User);

    const companies: Company[] = await queryRunner.manager.find(Company);
    generateRole(users, companies);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Role);
  }
}
