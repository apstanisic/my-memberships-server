import { Test, TestingModule } from '@nestjs/testing';
import { CompanyImagesService } from './company-images.service';
import { StorageService } from '../../core/storage/storage.service';

describe('CompanyImagesService', () => {
  let service: CompanyImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyImagesService,
        {
          provide: StorageService,
          useFactory: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CompanyImagesService>(CompanyImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
