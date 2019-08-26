import { Module } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';
import { APP_GUARD } from '@nestjs/core';

/** Access control module. Register global guards */
@Module({
  providers: [
    // This is needed because of DI
    { provide: APP_GUARD, useClass: PermissionsGuard }
  ]
})
export class AccessControlModule {}
