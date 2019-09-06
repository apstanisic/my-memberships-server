import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  ForbiddenException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UpdatePasswordData, LoginData } from '../auth/auth.dto';
import { UsersService } from './user.service';
import { removeEmptyItems } from '../core/helpers';
import { UpdateUserInfo } from './update-user.dto';
import { ValidUUID } from '../core/uuid.pipe';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /* Update user password */
  @Put('password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() data: UpdatePasswordData): Promise<User> {
    const { email, oldPassword, newPassword } = data;

    const user = await this.usersService.findForLogin(email, oldPassword);
    user.password = newPassword;
    return this.usersService.update(user, user);
  }

  /* Update user info */
  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(
    @Body() updateData: UpdateUserInfo,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.update(user, updateData);
  }

  /* Get user info */
  @Get('account')
  @UseGuards(AuthGuard('jwt'))
  getAccount(@GetUser() user: User) {
    return user;
  }

  @Delete('account')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(
    @GetUser() user: User,
    @Body() { email, password }: LoginData,
  ) {
    if (user.email !== email) throw new ForbiddenException();
    if (!(await user.checkPassword(password))) throw new ForbiddenException();
    try {
      // for (let i = 0; i < user.ads.length; i++) {
      //   await this.adService.remove(user.ads[i]);
      // }
      await this.usersService.delete(user);
      return { message: 'User deleted.' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('users/:id')
  GetUser(@Param('id', ValidUUID) id: string) {
    return this.usersService.findOne(id);
  }
}
