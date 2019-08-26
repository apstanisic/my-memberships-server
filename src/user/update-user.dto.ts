import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data that is provided when changing user info
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
  @MinLength(8)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  avatar?: string;
}
