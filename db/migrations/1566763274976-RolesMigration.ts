import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../src/user/user.entity';
import { Company } from '../../src/company/company.entity';
import {
  generateRole,
  generateUserRole,
} from '../../src/core/access-control/role.factory';
import { Role } from '../../src/core/access-control/roles.entity';

export class RolesMigration1566763274976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roles: Role[] = [];
    const users: User[] = await queryRunner.manager.find(User);
    const companies: Company[] = await queryRunner.manager.find(Company);

    for (let i = 0; i < 300; i += 1) {
      roles.push(generateRole(users, companies.map(c => c.id)));
    }
    users.forEach(user => roles.push(generateUserRole(user)));
    await queryRunner.manager.save(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Role);
  }
}
