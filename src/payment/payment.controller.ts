import { Controller, UseGuards, Body, Post, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { ChangeCreditDto } from './payment.dto';
import { PaymentService } from './payment.service';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('app/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** replace old credit value with provided amount */
  @IfAllowed()
  @Post('')
  setCredit(
    @Body() { price, companyId }: ChangeCreditDto,
    @GetUser() user: User,
  ): Promise<number> {
    return this.paymentService.replaceCredit(companyId, price, user);
  }

  /** adds or subtracts credit with provided amount */
  @IfAllowed()
  @Put('')
  changeCredit(
    @Body() { price, companyId, credit }: ChangeCreditDto,
    @GetUser() user: User,
  ): Promise<number> {
    return this.paymentService.changeCredit({ companyId, price, user, credit });
  }
}
