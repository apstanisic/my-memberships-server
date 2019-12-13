import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { PaymentRecord } from './payment-record.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CompanyPaymentController } from './company-payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRecord]), CompanyModule],
  providers: [PaymentService],
  controllers: [PaymentController, CompanyPaymentController],
})
export class PaymentModule {}
