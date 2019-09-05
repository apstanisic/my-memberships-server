import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArrivalsService } from './arrivals.service';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { LocationsService } from '../locations/locations.service';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { SubscriptionService } from '../subscription/subscription.service';
import { Arrival } from './arrivals.entity';

@Controller()
export class ArrivalsController {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly subscriptionsService: SubscriptionService,
    private readonly locationService: LocationsService,
  ) {}

  /**
   * Get paginated arrivals for provided location
   * Must first fetch company, couse we need to check if
   * location belongs to given company
   */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('companies/:companyId/locations/:locationId/arrivals')
  async findLocationsArrivals(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @GetPagination() params: PaginationParams,
  ) {
    return this.arrivalsService.paginate({ ...params, where: { locationId } });
  }

  /**
   * Get paginated arrivals for provided location
   * Must first fetch company, couse we need to check if
   * location belongs to given company
   */
  @IfAllowed('read')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('users/:userId/subscriptions/:sid/arrivals')
  async findUserArrivals(
    // @Param('companyId', ValidUUID) companyId: string,
    @Param('userId', ValidUUID) userId: string,
    @Param('sid', ValidUUID) sid: string,
    @GetPagination() params: PaginationParams,
    @GetUser() user: User,
  ) {
    if (userId !== user.id || user.subscriptionIds.every(s => s !== sid)) {
      throw new ForbiddenException();
    }

    return this.arrivalsService.paginate({
      ...params,
      where: { subscriptionId: sid },
    });
  }

  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('companies/:cid/locations/:lid/arrivals')
  async newArrival(
    @Param('cid', ValidUUID) companyId: string,
    @Param('lid', ValidUUID) locationId: string,
    @Body('subscriptionId') subscriptionId: string,
  ) {
    const { address, lat, long } = await this.locationService.findOne({
      locationId,
      companyId,
    });
    const arrival = new Arrival();
    arrival.address = address;
    arrival.lat = lat;
    arrival.long = long;
    arrival.subscriptionId = subscriptionId;

    return this.arrivalsService.create(arrival);
  }

  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post('companies/:cid/locations/:lid/arrivals/:aid')
  async deleteArrival(
    @Param('cid', ValidUUID) companyId: string,
    @Param('lid', ValidUUID) locationId: string,
    @Param('aid', ValidUUID) arrivalId: string,
  ) {
    const location = await this.locationService.findOne(
      {
        locationId,
        companyId,
      },
      { select: ['id'] },
    );
    const arrival = await this.arrivalsService.findOne(
      {
        locationId,
        id: arrivalId,
      },
      { select: ['id'] },
    );

    return this.arrivalsService.delete(arrival);
  }
}
