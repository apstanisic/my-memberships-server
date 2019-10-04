import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageImagesService } from './storage-images.service';

/** Even though StorageModule is global, it's imported here just in case */
@Global()
@Module({
  providers: [StorageService, StorageImagesService],
  exports: [StorageService, StorageImagesService],
})
export class StorageModule {}
