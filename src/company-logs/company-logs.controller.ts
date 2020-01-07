import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  DbLoggerService,
  GetPagination,
  DbLog,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { CompanyLogsGuard } from './company-logs.guard';
import { GetCompany } from './company.decorator';
import { Company } from '../companies/company.entity';

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
  @Get()
  getLogs(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
  ): PgResult<DbLog> {
    return this.dbLogger.paginate(params, { domainId: company.id });
  }

  /** Get paginated logs for specific entity (location, subscription...) */
  @Get('items/:entityId')
  getLogsOnSpecificEntity(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
    @Param('entityId', ValidUUID) entityId: UUID,
  ): PgResult<DbLog> {
    return this.dbLogger.paginate(params, { entityId, domainId: company.id });
  }

  /** Get actions from specific user */
  @Get('users/:userId')
  getLogsByUser(
    @GetPagination() params: PaginationParams,
    @GetCompany() company: Company,
    @Param('userId', ValidUUID) userId: UUID,
  ): PgResult<DbLog> {
    return this.dbLogger.paginate(params, {
      domainId: company.id,
      executedById: userId,
    });
  }

  /** Get paginated logs */
  @Get(':logId')
  async getLogById(
    @Param('logId', ValidUUID) logId: UUID,
    @GetCompany() company: Company,
  ): Promise<DbLog> {
    return this.dbLogger.findOne({
      id: logId,
      domainId: company.id,
    });
  }
}
