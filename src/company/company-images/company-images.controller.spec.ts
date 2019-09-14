import { Test, TestingModule } from '@nestjs/testing';
import { CompanyImagesController } from './company-images.controller';

describe('CompanyImages Controller', () => {
  let controller: CompanyImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyImagesController],
    }).compile();

    controller = module.get<CompanyImagesController>(CompanyImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
