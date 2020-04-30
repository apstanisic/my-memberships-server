import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, GetUser, PermissionsGuard, UUID, ValidUUID } from 'nestjs-extra';
import { v4 as uuid } from 'uuid';
import { validImage } from '../company-images/multer-options';
import { Location } from '../locations/location.entity';
import { User } from '../users/user.entity';
import { LocationImage } from './location-image.entity';
import { LocationImagesService } from './location-images.service';

@Controller('companies/:companyId/locations/:locationId/images')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LocationImagesController {
  constructor(private readonly locationImagesService: LocationImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', validImage))
  async addImageToLocation(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) locationId: UUID,
    @GetUser() loggedUser: User,
  ): Promise<Location | any> {
    if (file?.buffer === undefined) throw new BadRequestException();

    // All sizes original image, and then replace original with right size
    // const filename = await this.storageService.put(file, `temp-file/${uuid()}`);
    // this.queue.add('location-image', { filename }, { attempts: 3 });
    const tempImage = await this.locationImagesService.addImageToProcessing({
      file: file.buffer,
      locationId,
      companyId,
    });
    return tempImage;

    // return this.locationImagesService.addImage({
    //   locationId,
    //   companyId,
    //   loggedUser,
    //   fileBuffer: file.buffer,
    // });
  }

  /** Remove image of location */
  @Delete(':imageId')
  async removeImageFromLocation(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) locationId: UUID,
    @Param('imageId', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<LocationImage> {
    return this.locationImagesService.removeImage({
      companyId,
      locationId,
      user,
      id,
    });
  }
}
