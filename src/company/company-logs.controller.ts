import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { DbLoggerService } from '../core/logger/db-logger.service';
import { Log } from '../core/logger/log.entity';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PgResult } from '../core/pagination/pagination.types';
import { UUID } from '../core/types';
import { ValidUUID } from '../core/uuid.pipe';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { CompanyService } from './company.service';
import { GetCompany } from './get-company.pipe';
import { Company } from './company.entity';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/logs')
export class CompanyLogsController {
  constructor(private readonly dbLogger: DbLoggerService) {}

  /** Get paginated logs */
  @IfAllowed('read')
  @Get()
  getLogs(
    @GetPagination() params: PaginationParams,
    @Param('companyId', GetCompany) company: Company,
  ): PgResult<Log> {
    if (this.isFreeTier(company)) throw new ForbiddenException();
    return this.dbLogger.paginate(params, { domainId: company.id });
  }

  /** Get paginated logs for specific entity (location, subscription...) */
  @IfAllowed('read')
  @Get('items/:entityId')
  getLogsOnSpecificEntity(
    @GetPagination() params: PaginationParams,
    @Param('companyId', GetCompany) company: Company,
    @Param('entityId', ValidUUID) entityId: UUID,
  ): PgResult<Log> {
    if (this.isFreeTier(company)) throw new ForbiddenException();
    return this.dbLogger.paginate(params, { entityId, domainId: company.id });
  }

  /** Get actions from specific user */
  /** @todo Test if executedBy: {id: id} works */
  @IfAllowed('read')
  @Get('users/:userId')
  getLogsByUser(
    @GetPagination() params: PaginationParams,
    @Param('companyId', GetCompany) company: Company,
    @Param('userId', ValidUUID) userId: UUID,
  ): PgResult<Log> {
    if (this.isFreeTier(company)) throw new ForbiddenException();
    return this.dbLogger.paginate(params, {
      domainId: company.id,
      executedBy: {
        id: userId,
      },
    });
  }

  /**
   * Get actions from specific user.
   * @TODO this does not work. It has to have specific column.
   */
  // @Get('location/:locationId')
  @IfAllowed('read')
  getLogsInLocation(
    @GetPagination() params: PaginationParams,
    @Param('companyId', GetCompany) company: Company,
    @Param('locationId', ValidUUID) locationId: UUID,
  ): PgResult<Log> {
    if (this.isFreeTier(company)) throw new ForbiddenException();
    return this.dbLogger.paginate(params, {
      domainId: company.id,
      // This should be location id.
      entityId: locationId,
    });
  }

  /** Get paginated logs */
  @IfAllowed('read')
  @Get(':logId')
  async getLogById(
    @Param('logId', ValidUUID) logId: UUID,
    @Param('companyId', GetCompany) company: Company,
  ): Promise<Log> {
    if (this.isFreeTier(company)) throw new ForbiddenException();
    const logs = await this.dbLogger.find({ id: logId, domainId: company.id });
    if (logs.length !== 1) throw new NotFoundException();
    return logs[0];
  }

  private isFreeTier(company: Company): boolean {
    return company.tier === 'free';
  }
}
