import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PgResult } from '../core/pagination/pagination.types';
import { ValidUUID } from '../core/uuid.pipe';
import { Arrival } from './arrivals.entity';
import { ArrivalsService } from './arrivals.service';

/**
 * Access arrivals directly by company.
 * With this we can do: companies/213/arrivals instead of
 * companies/213/locations/5124/arrivals
 */
@Controller('companies/:companyId/arrivals')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class CompanyArrivalsController {
  constructor(private readonly arrivalsService: ArrivalsService) {}

  @Get('')
  @IfAllowed('read')
  async find(
    @Param('companyId', ValidUUID) companyId: string,
    @GetPagination() params: PaginationParams,
  ): PgResult<Arrival> {
    // const location = await this.validLocation(companyId);
    return this.arrivalsService.paginate(params, { companyId });
  }

  @Get(':arrivalId')
  @IfAllowed('read')
  async findById(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('arrivalId', ValidUUID) arrivalId: string,
  ): Promise<Arrival> {
    return this.arrivalsService.findOne({ id: arrivalId, companyId });
  }
}
