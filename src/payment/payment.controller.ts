import {
  Body,
  Controller,
  NotImplementedException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PermissionsGuard, GetUser } from 'nestjs-extra';
import { User } from '../user/user.entity';
import { ChangeCreditDto } from './payment.dto';
import { PaymentService } from './payment.service';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('app/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** adds or subtracts credit with provided amount */
  @Put('')
  async changeCredit(
    @Body() { price, companyId, credit }: ChangeCreditDto,
    @GetUser() user: User,
  ): Promise<number> {
    return this.paymentService.changeCredit({ companyId, price, user, credit });
  }

  getCompanyPayments(): void {
    throw new NotImplementedException();
  }
}
