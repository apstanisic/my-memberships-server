import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { validImage } from '../company/company-images/multer-options';
import { LoginUserDto, UpdatePasswordDto } from '../core/auth/auth.dto';
import { StorageService } from '../core/storage/storage.service';
import { ValidUUID } from '../core/uuid.pipe';
import { GetUser } from './get-user.decorator';
import { UpdateUserInfo } from './update-user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  /** Update user password */
  @Put('password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() data: UpdatePasswordDto): Promise<User> {
    const { email, oldPassword, newPassword } = data;

    const user = await this.usersService.findForLogin(email, oldPassword);
    user.password = newPassword;
    return this.usersService.mutate(user, {
      user,
      domain: user.id,
      reason: 'Change password.',
    });
  }

  /** Update user avatar */
  @UseInterceptors(FileInterceptor('file', validImage))
  @Put('avatar')
  @UseGuards(AuthGuard('jwt'))
  async addProfilePicture(
    @UploadedFile() file: any,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.changeAvatar(user, file);
  }

  /** Remove user avatar */
  @Delete('avatar')
  @UseGuards(AuthGuard('jwt'))
  async removeProfilePicture(@GetUser() user: User): Promise<User> {
    return this.usersService.removeAvatar(user);
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
    @Body() { email, password }: LoginUserDto,
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
