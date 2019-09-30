import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Put,
  Query,
  NotImplementedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PgResult } from '../core/pagination/pagination.types';
import { PaginationParams } from '../core/pagination/pagination-options';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { UUID } from '../core/types';
import { ManyUUID } from '../core/many-uuid.pipe';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/subscriptions')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  // @IfAllowed('read')
  // @Get('many')
  // findByIds(@Query('ids', ManyUUID) ids: UUID[]): Promise<Subscription[]> {
  //   throw new NotImplementedException();
  //   return this.service.findByIds(ids);
  // }

  /** Get subscriptions, filtered and paginated */
  @IfAllowed('read')
  @Get('')
  get(
    @GetPagination() pg: PaginationParams,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): PgResult<Subscription> {
    return this.service.paginate(pg, { companyId });
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
    return this.service.create(
      { ...subscription, companyId },
      { user, domain: companyId },
    );
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

  /** Update subscription */
  @IfAllowed()
  @Put(':id')
  async update(
    @Param('id', ValidUUID) id: UUID,
    @Body() updateData: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.service.update(id, updateData);
  }
}
