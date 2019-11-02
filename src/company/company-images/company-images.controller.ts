import {
  Controller,
  Delete,
  ForbiddenException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AuthGuard,
  PermissionsGuard,
  UUID,
  ValidUUID,
  GetUser,
} from 'nestjs-extra';
import { Location } from '../../locations/location.entity';
import { LocationsService } from '../../locations/locations.service';
import { User } from '../../user/user.entity';
import { Company } from '../company.entity';
import { CompanyService } from '../company.service';
import { CompanyImagesService } from './company-images.service';
import { validImage } from './multer-options';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId')
export class CompanyImagesController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly locationService: LocationsService,
    private readonly companyImageService: CompanyImagesService,
  ) {}

  /** Add new image of a company */
  @UseInterceptors(FileInterceptor('file', validImage))
  @Post('images')
  async addImageToCompany(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() user: User,
  ): Promise<Company> {
    const company = await this.companyService.findOne(companyId);
    if (!this.companyImageService.canAddImageToCompany(company)) {
      throw new ForbiddenException('Max quota reached.');
    }
    company.images = await this.companyImageService.addImage(
      file,
      company.images,
    );

    return this.companyService.mutate(company, {
      user,
      reason: 'Add image',
      domain: company.id,
    });
  }

  /** Remove image of company */
  @Delete('images/:imageId')
  async removeImageFromCompany(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('imageId', ValidUUID) imageId: UUID,
    @GetUser() user: User,
  ): Promise<Company> {
    const company = await this.companyService.findOne(companyId);
    company.images = await this.companyImageService.removeImage(
      imageId,
      company.images,
    );
    return this.companyService.mutate(company, {
      user,
      reason: 'Add image',
      domain: company.id,
    });
  }

  /** Add new image of location */
  @Post('locations/:locationId/images')
  @UseInterceptors(FileInterceptor('file', validImage))
  async addImageToLocation(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) id: UUID,
    @GetUser() user: User,
  ): Promise<Location> {
    const location = await this.locationService.findOne(
      { companyId, id },
      { relations: ['company'] },
    );

    if (!this.companyImageService.canAddImageToLocation(location)) {
      throw new ForbiddenException('Quota reached');
    }

    location.images = await this.companyImageService.addImage(
      file,
      location.images,
    );

    return this.locationService.mutate(location, {
      user,
      reason: 'Add image',
      domain: companyId,
    });
  }

  /** Remove image of location */
  @Delete('locations/:locationId/images/:imageId')
  async removeImageFromLocation(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('locationId', ValidUUID) id: UUID,
    @Param('imageId', ValidUUID) imageId: UUID,
    @GetUser() user: User,
  ): Promise<Location> {
    const location = await this.locationService.findOne({ companyId, id });

    location.images = await this.companyImageService.removeImage(
      imageId,
      location.images,
    );

    return this.locationService.mutate(location, {
      user,
      reason: 'Delete image.',
      domain: companyId,
    });
  }
}
