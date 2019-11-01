import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  IdArrayDto,
  IfAllowed,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  ValidUUID,
} from 'nestjs-extra';
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

  @Get('ids')
  async getByIds(@Query() query: IdArrayDto): Promise<Arrival[]> {
    return this.arrivalsService.findByIds(query.ids);
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
