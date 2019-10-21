import { Module, Global } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global()
@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
