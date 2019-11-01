import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GetPagination,
  IfAllowed,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  ValidReason,
  ValidUUID,
} from 'nestjs-extra';
import { Location } from '../locations/location.entity';
import { LocationsService } from '../locations/locations.service';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Arrival } from './arrivals.entity';
import { ArrivalsService } from './arrivals.service';

/**
 * Keep track of arrivals in subscriptions and locations.
 * There is no update on arrival. You can only come.
 * @method find Fitler and paginate arrivals.
 * @method findById Find arrival by id.
 * @method newArrival Creates new arrival.
 * @method deleteArrival Delete arrival.
 */
@Controller('companies/:companyId/locations/:locationId/arrivals')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LocationArrivalsController {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly locationService: LocationsService,
  ) {}

  /**
   * Get paginated arrivals for provided location.
   * First check if location belongs to parent company.
   */
  @Get('')
  @IfAllowed('read')
  async find(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @GetPagination() params: PaginationParams,
  ): PgResult<Arrival> {
    const location = await this.validLocation(companyId, locationId);
    return this.arrivalsService.paginate(params, { location });
  }

  @Get(':arrivalId')
  @IfAllowed('read')
  async findById(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @Param('arrivalId', ValidUUID) arrivalId: string,
  ): Promise<Arrival> {
    const location = await this.validLocation(companyId, locationId);
    return this.arrivalsService.findOne({ id: arrivalId, location });
  }

  /** Add new arrival. */
  @IfAllowed()
  @Post('')
  async newArrival(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @Body('subscriptionId') subscriptionId: string,
    @GetUser() user: User,
  ): Promise<Arrival> {
    const location = await this.validLocation(companyId, locationId);
    return this.arrivalsService.newArrival(location, subscriptionId, user);
  }

  /** Remove arrival. Admins can cancel arrival if needed */
  @IfAllowed()
  @Post(':arivalId')
  async deleteArrival(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @Param('arivalId', ValidUUID) arrivalId: string,
    @GetUser() user: User,
    @Body('reason', ValidReason) reason?: string,
  ): Promise<Arrival> {
    await this.validLocation(companyId, locationId);
    return this.arrivalsService.deleteWhere(
      { locationId, id: arrivalId },
      { user, reason },
    );
  }

  /**
   * Must be run for each method to check if location belongs to company
   * FindOne throws an error if result is not found
   */
  private async validLocation(
    companyId: string,
    locationId: string,
  ): Promise<Location> {
    return this.locationService.findOne({ companyId, id: locationId });
  }
}
