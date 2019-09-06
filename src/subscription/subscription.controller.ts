import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PgResult } from '../core/pagination/pagination.types';
import { PaginationParams } from '../core/pagination/pagination-options';
import { User } from '../user/user.entity';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { GetUser } from '../user/get-user.decorator';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { ValidUUID } from '../core/uuid.pipe';
import { PermissionsGuard } from '../access-control/permissions.guard';
import { UUID } from '../core/types';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/subscriptions')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @IfAllowed('read')
  @Get('many/:ids')
  findByIds(@Param('ids') ids: string[]): Promise<Subscription[]> {
    return this.service.findByIds(ids);
  }

  /* Get ads, filtered and paginated */
  @IfAllowed('read')
  @Get('')
  get(@GetPagination() pg: PaginationParams): PgResult<Subscription> {
    return this.service.paginate(pg);
  }

  /* Get subscription by id */
  @IfAllowed('read')
  @Get(':id')
  findById(@Param('id', ValidUUID) id: string): Promise<Subscription> {
    return this.service.findOne(id);
  }

  /** Create new subscription */
  @IfAllowed()
  @Post()
  async create(
    @Body() subscription: CreateSubscriptionDto,
    @Param('companyId') companyId: UUID,
  ): Promise<Subscription> {
    return this.service.create({ ...subscription, companyId });
  }

  /* Remove subscription */
  @IfAllowed()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Subscription> {
    return this.service.delete(id);
  }

  /** Update subscription */
  @IfAllowed()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.service.update(id, updateData);
  }
}
