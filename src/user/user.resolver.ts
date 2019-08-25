import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './user.service';

/**
 * Resolves user
 */
@Resolver((of: any) => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => User, { name: 'user' })
  async getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
}
