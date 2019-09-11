import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesRolesController } from './companies-roles.controller';
import { Role } from '../core/access-control/roles.entity';
import { AccessControlModule } from '../core/access-control/access-control.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AccessControlModule],
  controllers: [CompaniesRolesController],
})
export class CompaniesRolesModule {}
