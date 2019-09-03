import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PaginationOptions,
  PaginationResponse,
} from '../core/pagination/pagination.types';
import { User } from '../user/user.entity';
import { OrmQueryPipe, OrmQuery } from '../core/typeorm/orm-query.pipe';
import { GetPagination } from '../core/pagination/pagination.decorator';
import { GetUser } from '../user/get-user.decorator';
import { IfAllowed } from '../access-control/if-allowed.decorator';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import {
  CreateSubscriptionData,
  UpdateSubscriptionData,
} from './subscription.dto';

@Controller('subscriptions')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  /* Get ads, filtered and paginated */
  @Get()
  get(
    @Query(OrmQueryPipe) query: OrmQuery,
    @GetPagination() pg: PaginationOptions,
  ): PaginationResponse<Subscription> {
    return this.service.paginate(query, pg);
  }

  @Get('many/:ids')
  findByIds(@Param('ids') ids: string[]): Promise<Subscription[]> {
    return this.service.findByIds(ids);
  }

  /* Get subscription by id */
  @Get(':id')
  findById(@Param('id') id: string): Promise<Subscription> {
    return this.service.findById(id);
  }

  /** Create new subscription
   * @todo Must be specific
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() { companyId, ...subscription }: CreateSubscriptionData,
    @GetUser() user: User,
  ): Promise<Subscription> {
    return this.service.create({
      ...subscription,
      companyId,
      owner: user,
    });
  }

  /* Remove subscription */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @IfAllowed()
  remove(@Param('id') id: string): Promise<Subscription> {
    return this.service.delete(id);
  }

  /**
   * Update subscription
   * @todo updateData should not be null
   */
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @IfAllowed()
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateSubscriptionData,
  ): Promise<Subscription> {
    return this.service.update(id, updateData);
  }
}
