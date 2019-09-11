import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../../user/user.entity';

/** Data provided for login */
export class LoginData {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterData extends LoginData {
  @MinLength(2)
  name: string;
}

/** Data that is provided when changing password */
export class UpdatePasswordData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @MinLength(8)
  newPassword: string;
}

/** Server response for successful login */
export class SignInResponse {
  token: string;

  user: User;
}
