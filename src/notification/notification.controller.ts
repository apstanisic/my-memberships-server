import { Controller, Put, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ValidUUID } from '../core/uuid.pipe';
import { UUID } from '../core/types';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /** Set notification as "seen" */
  @Put(':id')
  async seeNotification(
    @Param('id', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Notification> {
    return this.notificationService.updateWhere(
      { id, user },
      { seenAt: new Date() },
    );
  }

  /** Delete notification */
  @Delete(':id')
  async deleteNotification(
    @Param('id', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Notification> {
    return this.notificationService.deleteWhere({ id, user });
  }
}
