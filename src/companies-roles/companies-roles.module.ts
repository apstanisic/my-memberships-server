import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesRolesController } from './companies-roles.controller';
import { CompaniesRolesService } from './companies-roles.service';
import { Role } from '../access-control/roles.entity';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AccessControlModule],
  controllers: [CompaniesRolesController],
  providers: [CompaniesRolesService],
})
export class CompaniesRolesModule {}
