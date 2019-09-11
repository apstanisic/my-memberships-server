import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('App Service', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should Have home page', () => {
    expect(appService.homePage()).toBe('My Subscriptions Api Home Page');
  });
});
