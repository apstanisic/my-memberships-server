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
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UpdatePasswordData, AuthData } from '../auth/auth.dto';
import { UsersService } from './user.service';
import { removeEmptyItems } from '../core/helpers';
import { UpdateUserInfo } from './update-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly usersService: UsersService // @Inject(forwardRef(() => AdsService)) private readonly adService: AdsService
  ) {}

  /* Update user password */
  @Put('password')
  @UseGuards(AuthGuard())
  async changePassword(@Body() data: UpdatePasswordData): Promise<User> {
    const { email, oldPassword, newPassword } = data;

    const user = await this.usersService.findForLogin(email, oldPassword);
    if (!user) throw new HttpException('Error updating', 500);
    await user.setPassword(newPassword);
    return this.usersService.update(user, user);
  }

  /* Update user info */
  @Put()
  @UseGuards(AuthGuard())
  async updateUserInfo(
    @Body() userInfo: UpdateUserInfo,
    @GetUser() user: User
  ): Promise<User> {
    const newData = removeEmptyItems(userInfo);
    return this.usersService.update(user, newData);
  }

  /* Get user info */
  @Get('account')
  @UseGuards(AuthGuard())
  getAccount(@GetUser() user: User) {
    return user;
  }

  @Delete('account')
  @UseGuards(AuthGuard())
  async deleteUser(
    @GetUser() user: User,
    @Body() { email, password }: AuthData
  ) {
    if (user.email !== email) throw new ForbiddenException();
    if (!(await user.comparePassword(password))) throw new ForbiddenException();
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
}
