import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

/** Controller in charge for getting user subscriptions */
@Controller('users/:userId/subscriptions')
export class UserSubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  /* Get subscriptions, filtered and paginated */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  get(
    @Param('userId', ValidUUID) ownerId: UUID,
    @GetPagination() pg: PaginationParams,
  ): PgResult<Subscription> {
    return this.service.paginate(pg, { ownerId });
  }

  /** Get subscription by id */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get(':id')
  findById(
    @Param('userId', ValidUUID) ownerId: UUID,
    @Param('id') id: string,
  ): Promise<Subscription> {
    return this.service.findOne({ id, ownerId });
  }
}
