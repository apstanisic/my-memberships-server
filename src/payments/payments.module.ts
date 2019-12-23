import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';
import { PaymentRecord } from './payment-record.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CompanyPaymentsController } from './company-payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRecord]), CompaniesModule],
  providers: [PaymentsService],
  controllers: [PaymentsController, CompanyPaymentsController],
})
export class PaymentsModule {}
