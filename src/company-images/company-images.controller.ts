import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import * as Faker from 'faker';
import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  NotImplementedException,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ValidUUID } from '../core/uuid.pipe';
import { UUID, ImageMetadata } from '../core/types';
import { PermissionsGuard } from '../core/access-control/permissions.guard';
import { validImage } from './multer-options';
import { CompanyService } from '../company/company.service';
import { LocationsService } from '../locations/locations.service';
import { CompanyImagesService } from './company-images.service';
import { Company } from '../company/company.entity';
import { Location } from '../locations/location.entity';

// @UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId')
export class CompanyImagesController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly locationService: LocationsService,
    private readonly imageService: CompanyImagesService,
  ) {}

  @Post('images')
  @UseInterceptors(FileInterceptor('file', validImage))
  async addImageToCompany(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
  ): Promise<Company> {
    const company = await this.companyService.findOne(companyId);
    // throw new NotImplementedException();
    company.images = await this.imageService.addImage(file, company.images);
    return this.companyService.update(company);
  }

  @Post('locations/:locationId/images')
  @UseInterceptors(FileInterceptor('file', validImage))
  async addImageToLocation(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) locationId: UUID,
  ): Promise<Location> {
    const location = await this.locationService.findOne({
      companyId,
      id: locationId,
    });
    location.images = await this.imageService.addImage(file, location.images);
    return this.locationService.update(location);
  }

  @Delete('images/:imageId')
  async removeImageFromCompany(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('imageId', ValidUUID) imageId: UUID,
  ): Promise<any> {
    const company = await this.companyService.findOne(companyId);
    // throw new NotImplementedException();
    company.images = await this.imageService.removeImage(
      imageId,
      company.images,
    );
    return this.companyService.update(company);
  }

  @Delete('locations/:locationId/images/:imageId')
  async removeImageFromLocation(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) locationId: UUID,
    @Param('imageId', ValidUUID) imageId: UUID,
  ): Promise<any> {
    const location = await this.locationService.findOne({
      companyId,
      id: locationId,
    });
    // throw new NotImplementedException();
    location.images = await this.imageService.removeImage(
      imageId,
      location.images,
    );
    return this.locationService.update(location);
  }
}
