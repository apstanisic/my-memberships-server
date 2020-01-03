import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  GetUser,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Arrival } from './arrival.entity';
import { ArrivalsService } from './arrivals.service';

/**
 * Get arrivals for users requests.
 * Every method is check if user have proper permissions,
 * and if each child belongs to parent, eg. sub belongs to user.
 * @method find Filters and paginates arrivals.
 * @method findById Find arrival by Id.
 */
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('users/:userId/arrivals')
export class UserArrivalsController {
  constructor(private readonly arrivalsService: ArrivalsService) {}

  /** Get paginated arrivals for provided subscription. */
  @Get('')
  async find(
    @Param('userId', ValidUUID) userId: UUID,
    @GetPagination() params: PaginationParams,
    @GetUser() user: User,
  ): PgResult<Arrival> {
    return this.arrivalsService.paginate(params, { user });
  }

  /** Get arrival by it's id */
  @Get(':id')
  async findById(
    @Param('userId', ValidUUID) userId: UUID,
    @Param('id', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Arrival> {
    return this.arrivalsService.findOne({ id, user });
  }
}
