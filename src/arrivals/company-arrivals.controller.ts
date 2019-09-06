import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { ArrivalsService } from './arrivals.service';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { LocationsService } from '../locations/locations.service';

/**
 * Keep track of arrivals in subscriptions and locations.
 * There is no update on arrival. You can only come.
 * @method find Fitler and paginate arrivals.
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
  ) {
    return this.arrivalsService.paginate(params, { locationId });
  }

  /** Add new arrival. */
  @IfAllowed()
  @Post('')
  async newArrival(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @Body('subscriptionId') subscriptionId: string,
  ) {
    const location = await this.locationService.findOne({
      locationId,
      companyId,
    });
    return this.arrivalsService.newArrival(location, subscriptionId);
  }

  /** Remove arrival. Admins can cancel arrival if needed */
  @IfAllowed()
  @Post(':aid')
  async deleteArrival(
    @Param('cid', ValidUUID) companyId: string,
    @Param('lid', ValidUUID) locationId: string,
    @Param('aid', ValidUUID) arrivalId: string,
  ) {
    await this.locationService.findOne({
      locationId,
      companyId,
    });
    const arrival = await this.arrivalsService.findOne({
      locationId,
      id: arrivalId,
    });

    return this.arrivalsService.delete(arrival);
  }
}
