import { ManyToOne, Entity, Column } from 'typeorm';
import { IsIn, IsString, IsOptional, Length } from 'class-validator';
import { User } from '../../user/user.entity';
import { RoleName, availableRoles } from './roles.list';
import { BaseEntity } from '../entities/base.entity';

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
