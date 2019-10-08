import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
