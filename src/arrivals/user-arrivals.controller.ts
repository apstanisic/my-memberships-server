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
import { PermissionsGuard } from '../access-control/permissions.guard';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

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

  /**
   * Get paginated arrivals for provided subscription.
   * First check if subscription belongs to user.
   */
  @Get('')
  async find(
    @Param('userId', ValidUUID) userId: string,
    @Param('subscriptionId', ValidUUID) sid: string,
    @GetPagination() params: PaginationParams,
    @GetUser() user: User,
  ) {
    if (userId !== user.id || user.subscriptionIds.every(s => s !== sid)) {
      throw new ForbiddenException();
    }

    return this.arrivalsService.paginate(params, { subscriptionId: sid });
  }

  /**
   */
  @Get(':id')
  async findById(
    @Param('userId', ValidUUID) userId: string,
    @Param('subscriptionId', ValidUUID) sid: string,
    @Param('id', ValidUUID) id: string,
    @GetUser() user: User,
  ) {
    if (userId !== user.id || user.subscriptionIds.every(s => s !== sid)) {
      throw new ForbiddenException();
    }

    return this.arrivalsService.findOne({ id, subscriptionId: sid });
  }
}
