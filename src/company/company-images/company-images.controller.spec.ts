import { Test, TestingModule } from '@nestjs/testing';
import { CompanyImagesController } from './company-images.controller';
import { CompanyService } from '../company.service';
import { LocationsService } from '../../locations/locations.service';
import { CompanyImagesService } from './company-images.service';

describe('CompanyImages Controller', () => {
  let controller: CompanyImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CompanyService, useFactory: jest.fn() },
        { provide: LocationsService, useFactory: jest.fn() },
        { provide: CompanyImagesService, useFactory: jest.fn() },
      ],
      controllers: [CompanyImagesController],
    }).compile();

    controller = module.get<CompanyImagesController>(CompanyImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
