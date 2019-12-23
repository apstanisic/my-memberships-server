import { Test, TestingModule } from '@nestjs/testing';
import { PricingPlansController } from './pricing-plans.controller';

describe('PricingPlan Controller', () => {
  let controller: PricingPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingPlansController],
    }).compile();

    controller = module.get<PricingPlansController>(PricingPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
