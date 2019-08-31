import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from './permissions.guard';
import { Role } from './roles.entity';
import { AccessControlService } from './access-control.service';

/** Access control module. Register global guards */
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    AccessControlService,
    // This is needed because of DI
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AccessControlModule {}
