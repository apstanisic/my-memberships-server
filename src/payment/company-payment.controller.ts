import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import {
  AuthGuard,
  GetPagination,
  PaginationParams,
  PermissionsGuard,
  PgResult,
  ValidUUID,
  UUID,
} from 'nestjs-extra';
import { PaymentRecord } from './payment-record.entity';
import { PaymentService } from './payment.service';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/payments')
export class CompanyPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** adds or subtracts credit with provided amount */
  @Get('')
  find(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetPagination() params: PaginationParams,
  ): PgResult<PaymentRecord> {
    return this.paymentService.paginate(params, { companyId });
  }

  @Get(':id')
  async findById(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('id', ValidUUID) id: UUID,
  ): Promise<PaymentRecord> {
    return this.paymentService.findOne({ id, companyId });
  }
}
