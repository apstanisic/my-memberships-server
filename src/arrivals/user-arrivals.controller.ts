import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  ValidUUID,
  GetUser,
  UUID,
} from 'nestjs-extra';
import { User } from '../user/user.entity';
import { Arrival } from './arrivals.entity';
import { ArrivalsService } from './arrivals.service';
import { UsersService } from '../user/user.service';

/**
 * Get arrivals for users requests.
 * Every method is check if user have proper permissions,
 * and if each child belongs to parent, eg. sub belongs to user.
 * @method find Filters and paginates arrivals.
 * @method findById Find arrival by Id.
 */
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
// @Controller('users/:userId/subscriptions/:subscriptionId/arrivals')
@Controller('users/:userId/arrivals')
export class UserArrivalsController {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly userService: UsersService,
  ) {}

  /** Get paginated arrivals for provided subscription. */
  @Get('')
  async find(
    @Param('userId', ValidUUID) userId: UUID,
    // @Param('subscriptionId', ValidUUID) subscriptionId: string,
    @GetPagination() params: PaginationParams,
    @GetUser() user: User,
  ): PgResult<Arrival> {
    if (user.id !== userId) throw new ForbiddenException();
    return this.arrivalsService.paginate(params, { user });
  }

  /** Get arrival by it's id */
  @Get(':id')
  async findById(
    @Param('userId', ValidUUID) userId: UUID,
    // @Param('subscriptionId', ValidUUID) subscriptionId: string,
    @Param('id', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Arrival> {
    if (user.id !== userId) throw new ForbiddenException();
    return this.arrivalsService.findOne({ id, user });
  }

  // /**
  //  * Check if user has access to this subscription
  //  *
  //  * @param user Logged user
  //  * @param uid User Id from request
  //  * @param sid Subscription Id from request
  //  */
  // private async validUser(user: User, uid: string, sid: string): Promise<void> {
  //   if (uid !== user.id) throw new ForbiddenException();

  //   const fetchedUser = await this.userService.findOne(uid, {
  //     relations: ['subscriptions'],
  //   });

  //   // If every subscription id is different from provided, throw an error
  //   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //   if (fetchedUser.subscriptions?.every(userSubId => userSubId.id !== sid)) {
  //     throw new ForbiddenException();
  //   }
  // }
}
