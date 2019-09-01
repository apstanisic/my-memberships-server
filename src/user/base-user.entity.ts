import { Column, Index, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import * as uuid from 'uuid';
import { Field } from 'type-graphql';
import { DefaultEntity } from '../core/default.entity';
import { IUser } from './user.interface';
import { Role } from '../access-control/roles.entity';

/**
 * This should be general user that can be extracted in seperate module.
 * There should be another entity User that contains app specific properties.
 */
export abstract class BaseUser extends DefaultEntity implements IUser {
  /** All roles user have */
  @OneToMany(type => Role, role => role.user, { eager: true })
  roles: Role[];

  /** User Email, has to be unique and to be valid email */
  @Column()
  @Index({ unique: true })
  @Field()
  @Length(8, 200)
  @IsEmail()
  email: string;

  /** Users password */
  @Column({ name: 'password' })
  @IsString()
  @Length(6, 220)
  @Exclude()
  _password: string;

  /** User real name */
  @Column()
  @Field()
  @IsString()
  @Length(2, 100)
  name: string;

  /** User's profile picture */
  @Column({ nullable: true, type: 'text' })
  @Field({ nullable: true })
  @Length(4, 600)
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
  @Column({ nullable: true })
  @Exclude()
  tokenCreatedAt?: Date;

  set password(newPassword: string) {
    this._password = bcrypt.hashSync(newPassword);
  }

  /** Check if provided password is valid */
  checkPassword(enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this._password);
  }

  /** Generate secure token to be used for password reset... */
  generateSecureToken() {
    this.secureToken = uuid();
    this.tokenCreatedAt = new Date();
    return this.secureToken;
  }

  /** Call this method after token is used */
  disableSecureToken() {
    this.secureToken = undefined;
    this.tokenCreatedAt = undefined;
  }

  /**
   *
   * Check if provided token is valid
   * User's token and createdAt date must be not null
   */
  compareToken(token: string) {
    if (!this.secureToken) return false;
    if (!this.tokenCreatedAt) return false;
    if (this.secureToken !== token) return false;
    return true;
  }
}
