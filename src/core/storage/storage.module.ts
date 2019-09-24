import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [StorageService],
})
export class StorageModule {}
