import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  GetUser,
  IdArrayDto,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { CompaniesService } from '../companies/companies.service';
import { User } from '../users/user.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { Subscription } from './subscription.entity';
import { SubscriptionsService } from './subscriptions.service';
// import { IdArrayDto } from '../core/id-array.dto';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly service: SubscriptionsService,
    private readonly companyService: CompaniesService,
  ) {}

  /** Get subscriptions, filtered and paginated */
  @Get('')
  get(
    @GetPagination() pg: PaginationParams,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): PgResult<Subscription> {
    return this.service.paginate(pg, { companyId });
  }

  /** @Todo this should not fetch owner automaticly */
  @Get('ids')
  async getSubsByIds(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Query() query: IdArrayDto,
  ): Promise<Subscription[]> {
    return this.service.findByIds(query.ids, {
      relations: ['owner'],
      where: { companyId },
    });
  }

  /**
   * Get users that have valid subscription from this company.
   * This is only used for auto complete
   */
  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUserFromCompany(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Query('email__lk') email: string,
    @Query('active') active?: boolean,
  ): Promise<{ data: User[] }> {
    const users = await this.service.getUsersWithSubscription(
      companyId,
      email,
      active,
    );
    return { data: users };
  }

  /** Get subscription by id */
  @Get(':id')
  findById(
    @Param('id', ValidUUID) id: UUID,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): Promise<Subscription> {
    return this.service.findOne({ id, companyId });
  }

  /** Create new subscription */
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
