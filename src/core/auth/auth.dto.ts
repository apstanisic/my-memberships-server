import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { BaseUser } from '../entities/base-user.entity';

/** Data provided for login */
export class LoginData {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(2, 200)
  password: string;
}

/** When reseting password, only new password is needed */
export class OnlyPasswordDto {
  @IsNotEmpty()
  @Length(8, 200)
  password: string;
}

export class RegisterData extends LoginData {
  @Length(2, 100)
  name: string;
}

/** Data that is provided when changing password */
export class UpdatePasswordData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @Length(8, 200)
  newPassword: string;
}

/** Server response for successful login */
export class SignInResponse {
  token: string;

  user: BaseUser;
}
