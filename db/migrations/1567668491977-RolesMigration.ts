import { generateRole, generateUserRole, Role } from 'nestjs-extra';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../../src/companies/company.entity';
import { User } from '../../src/users/user.entity';

export class RolesMigration1566763274976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roles: Role[] = [];
    const users: User[] = await queryRunner.manager.find(User);
    const companies: Company[] = await queryRunner.manager.find(Company);

    for (let i = 0; i < 3; i += 1) {
      users.forEach(user => {
        roles.push(
          generateRole(
            [user],
            companies.map(c => c.id),
          ),
        );
      });
    }
    users.forEach(user => roles.push(generateUserRole(user)));

    await queryRunner.manager.save(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.clear(Role);
  }
}
