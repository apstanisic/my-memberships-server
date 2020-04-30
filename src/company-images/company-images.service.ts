import { InjectQueue } from '@nestjs/bull';
import { ForbiddenException, Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  BaseService,
  StorageImagesService,
  StorageService,
  UUID,
  ConfigService,
  STORAGE_URL,
} from 'nestjs-extra';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { CompanyImage } from './company-image.entity';
import { companyImagesQueue, CompanyImagesQueueTasks } from './company-images.consts';

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
    @InjectQueue(companyImagesQueue) private readonly queue: Queue,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly storageImagesService: StorageImagesService,
    private readonly storageService: StorageService,
    private readonly companyService: CompaniesService,
  ) {
    super(repository);
  }

  /**
   * When controller accepts image, call this method
   * This method stores original image in s3 and db, then
   * generates the job that will create all image sizes,
   * update db with new sizes and then delete original image
   */
  async addImageToProcessing({
    file,
    companyId,
  }: {
    file: Buffer;
    companyId: UUID;
  }): Promise<CompanyImage> {
    // Check if location belongs to company
    const company = await this.companyService.findOne(companyId);

    if (!this.canAddImageToCompany(company)) throw new ForbiddenException('Quota reached');

    // Store original version
    const filename = await this.storageService.put(file, `tmp/${Date.now()}-${uuid()}.jpg`);

    // Store orignal version in db. All sizes are currently original version
    const image = await this.create({
      company,
      original: filename,
      prefix: filename,
      lg: filename,
      md: filename,
      xs: filename,
      sm: filename,
    });

    // Add job that will create all sizes
    this.queue.add(CompanyImagesQueueTasks.generateImages, { image }, { attempts: 3 });
    return image;
  }

  /**
   * Generate all sizes for given image, and replace placeholder sizes
   * with newly generated images.
   * @param image Image that has all sizes original image
   */
  async generateImageSizes(image: CompanyImage): Promise<CompanyImage> {
    // Original image s3 path
    const { original } = image;
    const s3url = this.configService.get(STORAGE_URL);
    const file = await this.httpService
      .get(`${s3url}/${original}`)
      .toPromise()
      .then(r => r.data);

    console.log(file);

    // Generate all image sizes
    const storedImage = await this.storageImagesService.storeImage(file);
    // Set original as undefined
    storedImage.original = undefined;
    // Update image in db
    const updated = await this.update(image, storedImage);
    // Delete original image
    if (original) {
      await this.storageService.delete(original);
    }
    return updated;
  }

  /** Add image to company */
  async addImage({ companyId, fileBuffer, loggedUser }: AddImageParams): Promise<CompanyImage> {
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
  async removeImage({ imageId, companyId, loggedUser }: RemoveImageParams): Promise<CompanyImage> {
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
