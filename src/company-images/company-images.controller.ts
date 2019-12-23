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
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { CompanyImagesService } from './company-images.service';
import { validImage } from './multer-options';
import { CompanyImage } from './company-image.entity';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('companies/:companyId')
export class CompanyImagesController {
  constructor(private readonly companyImageService: CompanyImagesService) {}

  /** Add new image of a company */
  @UseInterceptors(FileInterceptor('file', validImage))
  @Post('images')
  async addImageToCompany(
    @UploadedFile() file: any,
    @Param('companyId', ValidUUID) companyId: UUID,
    @GetUser() loggedUser: User,
  ): Promise<CompanyImage> {
    if (!file?.buffer) throw new BadRequestException();

    return this.companyImageService.addImage({
      companyId,
      loggedUser,
      fileBuffer: file.buffer,
    });
  }

  /** Remove image of company */
  @Delete('images/:imageId')
  async removeImageFromCompany(
    @Param('companyId', ValidUUID) companyId: UUID,
    @Param('imageId', ValidUUID) imageId: UUID,
    @GetUser() loggedUser: User,
  ): Promise<CompanyImage> {
    return this.companyImageService.removeImage({
      imageId,
      companyId,
      loggedUser,
    });
  }
}
