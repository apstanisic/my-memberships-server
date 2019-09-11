import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('App Controller', () => {
  let controller: AppController;

  const appServiceMock = jest.fn(() => ({
    homePage: (): string => 'My Subscription Home Page',
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useFactory: appServiceMock }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should Have home page', () => {
    expect(controller.homePage()).toBe('My Subscription Home Page');
  });
});
