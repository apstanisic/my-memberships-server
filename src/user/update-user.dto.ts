import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  Length,
} from 'class-validator';

/** Data that is provided when changing user info */
export class UpdateUserInfo {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(8, 50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  avatar?: string;
}
