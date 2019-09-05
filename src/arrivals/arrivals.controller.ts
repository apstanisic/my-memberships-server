import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArrivalsService } from './arrivals.service';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PaginationParams } from '../core/pagination/pagination-options';
import { LocationsService } from '../locations/locations.service';

@Controller()
export class ArrivalsController {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly locationService: LocationsService,
  ) {}

  /**
   * Get paginated arrivals for provided location
   * Must first fetch company, couse we need to check if
   * location belongs to given company
   */
  @IfAllowed()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get('/companies/:companyId/locations/:locationId/arrivals')
  async getArrivals(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('locationId', ValidUUID) locationId: string,
    @GetPagination() params: PaginationParams,
  ) {
    const location = await this.locationService.findOne({
      companyId,
      id: locationId,
    });
    return this.arrivalsService.paginate({ ...params, where: { location } });
  }
}
