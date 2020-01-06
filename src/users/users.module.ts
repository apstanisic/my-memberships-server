import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_SERVICE } from 'nestjs-extra';
import { User } from './user.entity';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

/**
 * User module depends on auth module and core folder.
 * It needs role entity in repository.
 * user.entity has some references to company and subscriptions.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), BullModule.registerQueue({ name: 'auth-email' })],
  controllers: [UserController],
  exports: [UsersService, { provide: USER_SERVICE, useClass: UsersService }],
  providers: [UsersService, { provide: USER_SERVICE, useClass: UsersService }],
})
export class UserModule {}
