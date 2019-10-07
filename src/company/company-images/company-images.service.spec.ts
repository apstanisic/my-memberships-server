import { Test, TestingModule } from '@nestjs/testing';
import { CompanyImagesService } from './company-images.service';
import { StorageService } from '../../core/storage/storage.service';
import { StorageImagesService } from '../../core/storage/storage-images.service';

describe('CompanyImagesService', () => {
  let service: CompanyImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyImagesService,
        {
          provide: StorageImagesService,
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
