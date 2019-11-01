import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  DbLoggerService,
  GetPagination,
  IfAllowed,
  Log,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { CompanyLogsGuard } from './company-logs.guard';
// import { IfAllowed } from '../core/access-control/if-allowed.decorator';
// import { PermissionsGuard } from '../core/access-control/permissions.guard';
// import { DbLoggerService } from '../core/logger/db-logger.service';
// import { Log } from '../core/logger/log.entity';
// import { PaginationParams } from '../core/pagination/pagination-options';
// import { GetPagination } from '../core/pagination/pagination.decorator';
// import { PgResult } from '../core/pagination/pagination.types';
// import { UUID } from '../core/types';
// import { ValidUUID } from '../core/uuid.pipe';
import { GetCompany } from './company.decorator';
import { Company } from './company.entity';

/** For GetCompany we have to use Company | any because ValidationPipe will
 * throw an error. It will check initial string, compare it to type of Company
 * and throw error because they don't match. Currently we can't change order.
 * And we can't disable ValidationPipe because it's used in many places,
 * even in this controller.
 */
@UseGuards(AuthGuard('jwt'), PermissionsGuard, CompanyLogsGuard)
@Controller('companies/:companyId/logs')
export class CompanyLogsController {
  constructor(private readonly dbLogger: DbLoggerService) {}

  /** Get paginated logs */
  @IfAllowed('read')
  @Get()
  getLogs(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
  ): PgResult<Log> {
    return this.dbLogger.paginate(params, { domainId: company.id });
  }

  /** Get paginated logs for specific entity (location, subscription...) */
  @IfAllowed('read')
  @Get('items/:entityId')
  getLogsOnSpecificEntity(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
    @Param('entityId', ValidUUID) entityId: UUID,
  ): PgResult<Log> {
    return this.dbLogger.paginate(params, { entityId, domainId: company.id });
  }

  /** Get actions from specific user */
  /** @todo Test if executedBy: {id: id} works */
  @IfAllowed('read')
  @Get('users/:userId')
  getLogsByUser(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
    @Param('userId', ValidUUID) userId: UUID,
  ): PgResult<Log> {
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
    @GetCompany() company: Company,
    @Param('locationId', ValidUUID) locationId: UUID,
  ): PgResult<Log> {
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
    @GetCompany() company: Company,
  ): Promise<Log> {
    return this.dbLogger.findOne({
      id: logId,
      domainId: company.id,
    });
  }
}
