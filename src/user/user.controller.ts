import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, IdArrayDto, ValidUUID, GetUser } from 'nestjs-extra';
// import { LoginUserDto, UpdatePasswordDto } from '../core/auth/auth.dto';
// import { StorageService } from '../core/storage/storage.service';
// import { ValidUUID } from '../core/uuid.pipe';
import { UpdateUserInfo } from './update-user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';
// import { Role } from '../core/access-control/roles.entity';
// import { IdArrayDto } from '../core/id-array.dto';

@Controller('auth')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /** Update user info */
  @Put()
  async updateUserInfo(
    @Body() updateData: UpdateUserInfo,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.update(user, updateData);
  }

  /** Get many users with provided ids */
  @Get('users/ids')
  async getUsersByIds(@Query() query: IdArrayDto): Promise<User[]> {
    return this.usersService.findByIds(query.ids);
  }

  /** Get general user info by id. Still needs to be logged in for now */
  @Get('users/:id')
  GetUser(@Param('id', ValidUUID) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
