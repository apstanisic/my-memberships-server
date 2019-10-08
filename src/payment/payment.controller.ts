import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { IfAllowed } from '../core/access-control/if-allowed.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('payment')
export class PaymentController {
  @IfAllowed()
  addCredit(): any {}

  @IfAllowed()
  removeCredit(): any {}

  @IfAllowed()
  changeTier(): any {}
}
