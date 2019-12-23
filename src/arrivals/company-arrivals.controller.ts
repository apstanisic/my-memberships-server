import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  IdArrayDto,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  ValidUUID,
  GetUser,
  UUID,
  ValidReason,
} from 'nestjs-extra';
import { Arrival } from './arrival.entity';
import { ArrivalsService } from './arrivals.service';
import { User } from '../users/user.entity';
import { CreateArrivalDto } from './arrival.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

/**
 * Access arrivals directly by company.
 * With this we can do: companies/213/arrivals instead of
 * companies/213/locations/5124/arrivals
 */
@Controller('companies/:companyId/arrivals')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class CompanyArrivalsController {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly subService: SubscriptionsService,
  ) {}

  @Get('')
  async find(
    @Param('companyId', ValidUUID) companyId: string,
    @GetPagination() params: PaginationParams,
  ): PgResult<Arrival> {
    // const location = await this.validLocation(companyId);
    return this.arrivalsService.paginate(params, { companyId });
  }

  @Get('ids')
  async getByIds(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Query() query: IdArrayDto,
  ): Promise<Arrival[]> {
    // Find by ids but only if it belongs to given company
    return this.arrivalsService.findByIds(query.ids, { where: { companyId } });
  }

  @Get(':arrivalId')
  async findById(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('arrivalId', ValidUUID) arrivalId: UUID,
  ): Promise<Arrival> {
    return this.arrivalsService.findOne({ id: arrivalId, companyId });
  }

  /** Add new arrival. */
  @Post('')
  async newArrival(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Body() { locationId, userId }: CreateArrivalDto,
    @GetUser() admin: User,
  ): Promise<Arrival> {
    return this.arrivalsService.newArrival({
      admin,
      locationId,
      companyId,
      userId,
    });
  }

  /**
   * Remove arrival. Admins can cancel arrival if needed.
   * For now it's as delete request but if there are future implement comments bellow
   * This is sent as post request because body in delete request is not defined.
   * Some clients can't sent body in delete request
   */
  @Delete(':arrivalId')
  async deleteArrival(
    @Param('companyId', ValidUUID) companyId: string,
    @Param('arrivalId', ValidUUID) arrivalId: string,
    @GetUser() loggedUser: User,
    @Body('reason', ValidReason) reason?: string,
  ): Promise<Arrival> {
    return this.arrivalsService.deleteArrival({
      companyId,
      arrivalId,
      reason,
      loggedUser,
    });
  }
}
