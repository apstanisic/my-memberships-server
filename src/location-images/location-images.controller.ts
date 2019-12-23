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
import {
  AuthGuard,
  GetUser,
  PermissionsGuard,
  UUID,
  ValidUUID,
} from 'nestjs-extra';
import { validImage } from '../company-images/multer-options';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';
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

    return this.locationImagesService.addImage({
      locationId,
      companyId,
      loggedUser,
      fileBuffer: file.buffer,
    });
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
