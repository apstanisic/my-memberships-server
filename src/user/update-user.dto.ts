import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data that is provided when changing user info
 * No password
 */
export class UpdateUserInfo {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  avatar?: string;
}
