import { Column, Index } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { random } from 'faker';
import { BaseEntity } from './base.entity';
import { IUser } from './user.interface';

/**
 * This should be general user that can be extracted in seperate module.
 * There should be another entity User that contains app specific properties.
 */
export class BaseUser extends BaseEntity implements IUser {
  /** User Email, has to be unique and to be valid email */
  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  /** Users password */
  @Column({ name: 'password' })
  @IsString()
  @Length(6, 200)
  @Exclude()
  _password: string;

  /** User real name */
  @Column()
  @IsString()
  @Length(2, 100)
  name: string;

  /** User's profile picture */
  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  @Length(10, 500)
  avatar?: string;

  /** Did user confirm his account */
  @Column({ default: false })
  @Exclude()
  confirmed: boolean;

  /** Can be used to confirm user, reset password, etc... */
  @Column({ nullable: true })
  @Exclude()
  secureToken?: string;

  /** Time when secureToken was created. Server decides token duration */
  @Column({ nullable: true, precision: 3 })
  @Exclude()
  tokenCreatedAt?: Date;

  /** Set new password and hash it automatically */
  set password(newPassword: string) {
    this._password = bcrypt.hashSync(newPassword);
  }

  /** Check if provided password is valid */
  checkPassword(enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this._password);
  }

  /** Generate secure token to be used for password reset... */
  generateSecureToken(): string {
    this.secureToken = random.uuid();
    this.tokenCreatedAt = new Date();
    return this.secureToken;
  }

  /** Call this method after token is used */
  disableSecureToken(): void {
    this.secureToken = undefined;
    this.tokenCreatedAt = undefined;
  }

  /** Check if provided token is valid */
  compareToken(token: string): boolean {
    if (!this.secureToken) return false;
    if (!this.tokenCreatedAt) return false;
    if (this.secureToken !== token) return false;
    return true;
  }
}
