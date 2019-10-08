import { Controller, UseGuards, Body, Post, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';
import { ChangeCreditDto, ChangeTierDto } from './payment.dto';
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
    @Body() { amount, companyId }: ChangeCreditDto,
    @GetUser() user: User,
  ): Promise<number> {
    return this.paymentService.replaceCredit(companyId, amount, user);
  }

  /** adds or subtracts credit with provided amount */
  @IfAllowed()
  @Put('')
  changeCredit(
    @Body() { amount, companyId }: ChangeCreditDto,
    @GetUser() user: User,
  ): Promise<number> {
    return this.paymentService.changeCredit(companyId, amount, user);
  }

  /** Change company tier */
  @IfAllowed()
  @Post('tier')
  changeTier(@Body() { companyId, tier }: ChangeTierDto): any {
    return this.paymentService.changeTier(companyId, tier);
  }
}
