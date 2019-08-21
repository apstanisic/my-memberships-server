import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UsersService],
  providers: [UsersService]
})
export class UserModule {}
