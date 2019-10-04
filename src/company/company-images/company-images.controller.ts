import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IfAllowed } from '../../core/access-control/if-allowed.decorator';
import { UUID } from '../../core/types';
import { ValidUUID } from '../../core/uuid.pipe';
import { Location } from '../../locations/location.entity';
import { LocationsService } from '../../locations/locations.service';
import { GetUser } from '../../user/get-user.decorator';
import { User } from '../../user/user.entity';
import { Company } from '../company.entity';
import { CompanyService } from '../company.service';
import { CompanyImagesService } from './company-images.service';
import { GetCompany } from '../get-company.pipe';
import { validImage } from './multer-options';

// @UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId')
export class CompanyImagesController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly locationService: LocationsService,
    private readonly companyImageService: CompanyImagesService,
  ) {}

  /** Add new image of a company */
  @UseInterceptors(FileInterceptor('file', validImage))
  @IfAllowed()
  @Post('images')
  async addImageToCompany(
    @UploadedFile() file: any,
    @Param('companyId', GetCompany) company: Company,
    @GetUser() user: User,
  ): Promise<Company> {
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
    @Param('companyId', GetCompany) company: Company,
    @Param('imageId', ValidUUID) imageId: UUID,
    @GetUser() user: User,
  ): Promise<Company> {
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
    const location = await this.locationService.findOne({ companyId, id });
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
