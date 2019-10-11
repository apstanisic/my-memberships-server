import { Test, TestingModule } from '@nestjs/testing';
import { PricingPlanController } from './pricing-plan.controller';

describe('PricingPlan Controller', () => {
  let controller: PricingPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingPlanController],
    }).compile();

    controller = module.get<PricingPlanController>(PricingPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
