import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';
import { BaseEntity } from '../entities/base.entity';
import { availableRoles, RoleName } from './roles.list';

/**
 * To add admin for company f32 to user
 * @example
 * const role = new Role();
 * role.user = user;
 * role.domain = 'f32';
 * role.name = 'admin';
 * role.description = 'You are admin in company f32. Happy b-day';
 * repo.save(role);
 */
@Entity()
export class Role extends BaseEntity {
  /** User that have this role */
  @ManyToOne(type => User, user => user.roles)
  user: User;

  /** User's id */
  @Column()
  userId: string;

  /** Role name */
  @Column()
  @IsString()
  @IsIn([...availableRoles])
  name: RoleName;

  /**
   * Domain this role belongs to. In this app domain is company
   * In other domain can be city, or store. Domain limit the reach of user.
   * Keep domain as string so it can be portable and not app specific.
   */
  @Column({ default: '/*' })
  @IsString()
  domain: string;

  /**
   * Description for this specific role to this user.
   * For example, owner can leave reason why admin have this role
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 2000)
  description?: string;
}
