import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AuthGuard,
  IdArrayDto,
  LoginUserDto,
  Role,
  UpdatePasswordDto,
  ValidUUID,
} from 'nestjs-extra';
import { validImage } from '../company/company-images/multer-options';
// import { LoginUserDto, UpdatePasswordDto } from '../core/auth/auth.dto';
// import { StorageService } from '../core/storage/storage.service';
// import { ValidUUID } from '../core/uuid.pipe';
import { GetUser } from './get-user.decorator';
import { UpdateUserInfo } from './update-user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';
// import { Role } from '../core/access-control/roles.entity';
// import { IdArrayDto } from '../core/id-array.dto';

@Controller('auth')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /** Update user password */
  @Put('password')
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
  async addProfilePicture(
    @UploadedFile() file: any,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.changeAvatar(user, file);
  }

  /** Remove user avatar */
  @Delete('avatar')
  async removeProfilePicture(@GetUser() user: User): Promise<User> {
    return this.usersService.removeAvatar(user);
  }

  /** Update user info */
  @Put()
  async updateUserInfo(
    @Body() updateData: UpdateUserInfo,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.update(user, updateData);
  }

  /** Get logged user info */
  @Get('account')
  getAccount(@GetUser() user: User): User {
    return user;
  }

  /** Delete user */
  @Delete('account')
  async deleteUser(
    @GetUser() loggedUser: User,
    @Body() { email, password }: LoginUserDto,
  ): Promise<User> {
    const user = await this.usersService.findForLogin(email, password);
    if (user.id !== loggedUser.id) throw new ForbiddenException();
    return this.usersService.delete(user, { user });
  }

  @Get('account/roles')
  getUsersRoles(@GetUser() { roles }: User): Role[] {
    return roles;
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
