import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { PgResult } from '../core/pagination/pagination.types';
import { UUID } from '../core/types';
import { ValidUUID } from '../core/uuid.pipe';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/company.entity';
import { IdArrayDto } from '../core/id-array.dto';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/subscriptions')
export class SubscriptionController {
  constructor(
    private readonly service: SubscriptionService,
    private readonly companyService: CompanyService,
  ) {}

  /** Get subscriptions, filtered and paginated */
  @IfAllowed('read')
  @Get('')
  get(
    @GetPagination() pg: PaginationParams,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): PgResult<Subscription> {
    return this.service.paginate(pg, { companyId });
  }

  @Get('ids')
  async getUsersByIds(@Query() query: IdArrayDto): Promise<Subscription[]> {
    return this.service.findByIds(query.ids, { relations: ['owner'] });
  }

  /** Get subscription by id */
  @IfAllowed('read')
  @Get(':id')
  findById(
    @Param('id', ValidUUID) id: UUID,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): Promise<Subscription> {
    return this.service.findOne({ id, companyId });
  }

  /** Create new subscription */
  @IfAllowed()
  @Post()
  async create(
    @Body() subscription: CreateSubscriptionDto,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
  ): Promise<Subscription> {
    const company = await this.companyService.findOne(companyId);
    return this.service.createSubscription({ user, company, subscription });
  }

  /** Update subscription */
  @IfAllowed()
  @Put(':id')
  async update(
    @Param('id', ValidUUID) id: UUID,
    @Body() updateData: UpdateSubscriptionDto,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
  ): Promise<Subscription> {
    return this.service.update(id, updateData, { user, domain: companyId });
  }

  /** Remove subscription */
  @IfAllowed()
  @Delete(':id')
  remove(
    @Param('id', ValidUUID) id: UUID,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
  ): Promise<Subscription> {
    return this.service.deleteWhere(
      { id, companyId },
      { user, domain: companyId },
    );
  }
}
