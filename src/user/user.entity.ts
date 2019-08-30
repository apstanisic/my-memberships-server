import {
  Entity,
  Column,
  OneToMany,
  Index,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import {
  IsEmail,
  validate,
  MinLength,
  IsString,
  MaxLength,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import * as uuid from 'uuid';
import { ObjectType, Field } from 'type-graphql';
import BaseException from '../core/BaseException';
import { isBcryptHash } from '../core/helpers';
import { Subscription } from '../subscription/subscription.entity';
import { Role } from '../access-control/roles.entity';
import { checkPremissions } from '../access-control/check-premissions';
import { Permission } from '../access-control/roles-permissions/permissions.list';
import { DefaultEntity } from '../core/default.entity';

/** User Entity */
@Entity('users')
@ObjectType({ description: 'User Model' })
export class User extends DefaultEntity {
  /** All roles user have */
  @OneToMany(type => Role, role => role.user, { eager: true })
  roles: Role[];

  /* Every subscription user have or had in the past */
  @OneToMany(type => Subscription, subscription => subscription.owner)
  @Field(type => [Subscription])
  subscriptions: Subscription[];

  /** User Email, has to be unique and to be valid email */
  @Column()
  @Index({ unique: true })
  @Field()
  @IsEmail()
  email: string;

  /** Users password */
  @Column({ name: 'password' })
  @IsString()
  @MinLength(6)
  @MaxLength(220)
  @Exclude()
  _password: string;

  /** User real name */
  @Column()
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  /** User's profile picture */
  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar?: string;

  /** Users phone number. It's not required */
  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

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

  /**
   * Check if user has required premission.
   * If resource is not provided it will check if user is allowed for all
   * @example
   *   user.allowedTo('delete_company', 'fdsa0fdsaf')
   */
  allowedTo(
    permissions: Permission | Permission[],
    resourceId?: string,
  ): boolean {
    return checkPremissions({ permissions, resourceId, user: this });
  }
}
//
//
//
//
/**
 * //  Companies where this user is owner
 * This is old design. With current role based this is not possible
 * Try something in future
 * @example
 *  @OneToMany(type => Company, company => company.owner)
 *  @Field(type => [Company])
 *  ownedCompanies: Company[];
 *
 *  //  All companies where this user is admin
 *  @ManyToMany(type => Company, company => company.admins)
 *  @Field(type => [Company])
 *  companiesWhereAdmin: Company[];
 *
 */
