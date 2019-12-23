import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, StorageImagesService, UUID } from 'nestjs-extra';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { CompaniesService } from '../companies/companies.service';
import { CompanyImage } from './company-image.entity';

interface RemoveImageParams {
  imageId: UUID;
  companyId: UUID;
  loggedUser: User;
}

interface AddImageParams {
  companyId: UUID;
  fileBuffer: any;
  loggedUser: User;
}

@Injectable()
export class CompanyImagesService extends BaseService<CompanyImage> {
  constructor(
    @InjectRepository(CompanyImage) repository: Repository<CompanyImage>,
    private readonly storageImagesService: StorageImagesService,
    private readonly companyService: CompaniesService,
  ) {
    super(repository);
  }

  /** Add image to company */
  async addImage({
    companyId,
    fileBuffer,
    loggedUser,
  }: AddImageParams): Promise<CompanyImage> {
    const company = await this.companyService.findOne(companyId);

    if (!this.canAddImageToCompany(company)) {
      throw new ForbiddenException('Max quota reached.');
    }

    const image = await this.storageImagesService.storeImage(fileBuffer);
    const companyImage = this.repository.create(image);
    companyImage.companyId = companyId;

    return this.create(image);
  }

  /** remove image from company */
  async removeImage({
    imageId,
    companyId,
    loggedUser,
  }: RemoveImageParams): Promise<CompanyImage> {
    // const company = await this.companyService.findOne(companyId);
    const image = await this.findOne({ id: imageId, companyId });
    const deleted = await this.delete(image);
    await this.storageImagesService.removeImage(image);
    return deleted;
  }

  /** Can user add new image to this company. Checks tier and images count */
  canAddImageToCompany(company: Company): boolean {
    const amountOfImages = company.images.length;
    if (company.tier === 'free' && amountOfImages >= 4) return false;
    if (company.tier === 'basic' && amountOfImages >= 6) return false;
    if (company.tier === 'pro' && amountOfImages >= 10) return false;
    if (company.tier === 'enterprise' && amountOfImages >= 20) return false;
    return true;
  }
}
