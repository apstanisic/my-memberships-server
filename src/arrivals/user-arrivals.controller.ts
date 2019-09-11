import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ArrivalsService } from './arrivals.service';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Arrival } from './arrivals.entity';
import { PgResult } from '../core/pagination/pagination.types';

/**
 * Get arrivals for users requests.
 * Every method is check if user have proper permissions,
 * and if each child belongs to parent, eg. sub belongs to user.
 * @method find Filters and paginates arrivals.
 * @method findById Find arrival by Id.
 */
@IfAllowed('read')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('users/:userId/subscriptions/:subscriptionId/arrivals')
export class UserArrivalsController {
  constructor(private readonly arrivalsService: ArrivalsService) {}

  /** Get paginated arrivals for provided subscription. */
  @Get('')
  async find(
    @Param('userId', ValidUUID) userId: string,
    @Param('subscriptionId', ValidUUID) subscriptionId: string,
    @GetPagination() params: PaginationParams,
    @GetUser() user: User,
  ): PgResult<Arrival> {
    this.validUser(user, userId, subscriptionId);
    return this.arrivalsService.paginate(params, { subscriptionId });
  }

  /** Get arrival by it's id */
  @Get(':id')
  async findById(
    @Param('userId', ValidUUID) userId: string,
    @Param('subscriptionId', ValidUUID) subscriptionId: string,
    @Param('id', ValidUUID) id: string,
    @GetUser() user: User,
  ): Promise<Arrival> {
    this.validUser(user, userId, subscriptionId);
    return this.arrivalsService.findOne({ id, subscriptionId });
  }

  /**
   * Check if user has access to this subscription
   *
   * @param user Logged user
   * @param uid User Id from request
   * @param sid Subscription Id from request
   */
  private validUser(user: User, uid: string, sid: string): void {
    if (
      uid !== user.id ||
      user.subscriptionIds.every(userSubId => userSubId !== sid)
    ) {
      throw new ForbiddenException();
    }
  }
}
