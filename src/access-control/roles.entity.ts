import { User } from '../user/user.entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoleEnum } from './roles-permissions/roles.list';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: RoleEnum;

  @Column({ nullable: true })
  resourceId?: string;

  @ManyToOne(type => User, user => user.roles)
  user: User;
}
