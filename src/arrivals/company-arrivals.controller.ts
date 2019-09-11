import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { ArrivalsService } from './arrivals.service';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { LocationsService } from '../locations/locations.service';
import { PgResult } from '../core/pagination/pagination.types';
import { Arrival } from './arrivals.entity';
import { Location } from '../locations/location.entity';

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
export class CompanyArrivalsController {
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
  ): Promise<Arrival> {
    const location = await this.validLocation(companyId, locationId);
    return this.arrivalsService.newArrival(location, subscriptionId);
  }

  /** Remove arrival. Admins can cancel arrival if needed */
  @IfAllowed()
  @Post(':aid')
  async deleteArrival(
    @Param('cid', ValidUUID) companyId: string,
    @Param('lid', ValidUUID) locationId: string,
    @Param('aid', ValidUUID) arrivalId: string,
  ): Promise<Arrival> {
    await this.validLocation(companyId, locationId);
    return this.arrivalsService.deleteWhere({ locationId, id: arrivalId });
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
