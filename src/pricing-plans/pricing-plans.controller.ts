import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, PermissionsGuard, UUID, ValidUUID, GetUser } from 'nestjs-extra';
// import { PermissionsGuard } from '../core/access-control/permissions.guard';
// import { UUID } from '../core/types';
// import { ValidUUID } from '../core/uuid.pipe';
import { User } from '../users/user.entity';
import { ExtendActivePlanDto, NewPricingPlanDto } from './pricing-plan.dto';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plans.service';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId/pricing-plans')
export class PricingPlansController {
  constructor(private readonly pricingPlanService: PricingPlanService) {}

  /** Start new plan, cancel old plans if exist */
  @Post('')
  async startNewPlan(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
    planData: NewPricingPlanDto,
  ): Promise<any> {
    return this.pricingPlanService.newPlan(companyId, planData, user);
  }

  /** Create new plan that start after currently active plan ends */
  @Post('extend')
  async continueAfterOldPlan(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
    planData: ExtendActivePlanDto,
  ): Promise<PricingPlan> {
    return this.pricingPlanService.continueAfterOldPlan({
      companyId,
      logUser: user,
      changes: planData,
    });
  }

  /** Remove active plan. User can manually remove plan if he/she wants */
  @Delete()
  async cancelCurrentPlan(
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
  ): Promise<PricingPlan> {
    return this.pricingPlanService.cancelActivePlan(companyId, user);
  }
}
