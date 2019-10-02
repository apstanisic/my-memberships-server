import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  Delete,
  ForbiddenException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UpdatePasswordData, LoginData } from '../core/auth/auth.dto';
import { UsersService } from './user.service';
import { UpdateUserInfo } from './update-user.dto';
import { ValidUUID } from '../core/uuid.pipe';

@Controller('auth')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /** Update user password */
  @Put('password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() data: UpdatePasswordData): Promise<User> {
    const { email, oldPassword, newPassword } = data;

    const user = await this.usersService.findForLogin(email, oldPassword);
    user.password = newPassword;
    return this.usersService.mutate(user, {
      user,
      domain: user.id,
      reason: 'Change password.',
    });
  }

  /** Update user info */
  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(
    @Body() updateData: UpdateUserInfo,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.update(user, updateData);
  }

  /** Get logged user info */
  @Get('account')
  @UseGuards(AuthGuard('jwt'))
  getAccount(@GetUser() user: User): User {
    return user;
  }

  /** Delete user */
  @Delete('account')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(
    @GetUser() loggedUser: User,
    @Body() { email, password }: LoginData,
  ): Promise<User> {
    const user = await this.usersService.findForLogin(email, password);
    if (user.id !== loggedUser.id) throw new ForbiddenException();
    return this.usersService.delete(user, { user });
  }

  /** Get general user info by id */
  @Get('users/:id')
  GetUser(@Param('id', ValidUUID) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
