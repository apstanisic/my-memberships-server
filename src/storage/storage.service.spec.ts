import { Client } from 'minio';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '../config/config.service';

// jest.mock('minio');
describe('StorageService', () => {
  let service: StorageService;
  let removeMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useFactory: () => {
            return {
              get(key: string) {
                return key;
              },
            };
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return promise when delete file', async () => {
    // expect(1).toBe(1);
    const testClient = new Client({} as any);
    expect(testClient.removeObject).not.toBeCalled();
    await service.delete('someFile');
    expect(testClient.removeObject).toBeCalled();
    expect(testClient.removeObject).toBeCalledWith(
      expect.anything(),
      'someFile',
      expect.anything(),
    );
    const response2 = await service.delete('otherfile');
    expect(response2).rejects.toThrow();
    // service.delete('random file');
    // expect()
  });
});
