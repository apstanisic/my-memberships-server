import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from './permissions.guard';
import { Role } from './roles.entity';
import { AccessControlService } from './access-control.service';
import { RoleService } from './role.service';

/** Access control module. Register global guards */
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    AccessControlService,
    RoleService,
    PermissionsGuard,
    // This is needed because of DI
    // { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [RoleService, AccessControlService, PermissionsGuard],
})
export class AccessControlModule {}
