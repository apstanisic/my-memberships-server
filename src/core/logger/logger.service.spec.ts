import { Test, TestingModule } from '@nestjs/testing';
import { DbLoggerService } from './db-logger.service';

describe('LoggerService', () => {
  let service: DbLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbLoggerService],
    }).compile();

    service = module.get<DbLoggerService>(DbLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
