import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional
} from 'class-validator';
import { User } from '../user/user.entity';

/* Data provided for login */
export class AuthData {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

/* Data that is provided when changing password */
export class UpdatePasswordData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}

/* Server response for successful login */
export class SignInResponse {
  token: string;
  user: Partial<User>;
}
