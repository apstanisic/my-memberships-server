import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { Role } from '../access-control/roles.entity';

/**
 * User module depends on auth module and core folder.
 * It needs role entity in repository.
 * user.entity has some references to company and subscriptions.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  exports: [UsersService],
  providers: [UsersService],
})
export class UserModule {}
