import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  BaseService,
  DbLogMetadata,
  Image,
  Notification,
  NotificationService,
  RoleService,
  UUID,
} from 'nestjs-extra';
import { Subscription } from 'src/subscriptions/subscription.entity';
import { Repository } from 'typeorm';
import { CompanyConfigService } from '../company-config/company-config.service';
import { User } from '../users/user.entity';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company) repository: Repository<Company>,
    @InjectQueue('app') private readonly queue: Queue,
    private readonly roleService: RoleService,
    private readonly notificationService: NotificationService,
    private readonly companyConfigService: CompanyConfigService,
  ) {
    super(repository);
  }

  /**
   * Creates new company and owner role.
   * We can't do create(entity, owner) cause of TS limitations.
   * Method must have same signature.
   * More info: https://stackoverflow.com/questions/33542359
   */
  async createCompany(
    companyData: Partial<Company>,
    owner: User,
    meta?: DbLogMetadata,
  ): Promise<Company> {
    const company = await this.create({ ...companyData, owner }, meta);

    if (meta) meta.domain = company.id;

    await this.roleService.create(
      {
        userId: owner.id,
        name: 'owner',
        domain: company.id,
      },
      meta,
    );
    await this.companyConfigService.create({
      company,
      version: 1,
      config: {},
    });

    return company;
  }

  /** Delete company and notify everyone that had subscription */
  async deleteCompany(companyId: UUID, meta: DbLogMetadata): Promise<Company> {
    const company = await this.findOne(companyId, {
      relations: ['subscriptions', 'images', 'locations', 'locations.images'],
    });

    await this.notifySubscriptionUsers(company.subscriptions, company.name);

    this.deleteCompanyImages(
      company.images,
      company.locations.flatMap(l => l.images),
    );

    await this.companyConfigService.delete(company.id);
    // This deletes many
    await this.roleService.getRepository().delete({ domain: company.id });
    return this.delete(company, meta);
  }

  /**
   * Notify users that have active subscriptions that company no longer exist.
   */
  private notifySubscriptionUsers(
    subs: Subscription[],
    companyName: string,
  ): Promise<Notification[]> {
    const notifications = subs
      .filter(sub => sub.active)
      .map(sub =>
        this.notificationService.addNotification({
          title: `Company ${companyName} does not exist anymore.`,
          userId: sub.ownerId,
        }),
      );
    return Promise.all(notifications);
  }

  /** Add job to delete all images from company and it's locations */
  private deleteCompanyImages(
    companyImages: Image[],
    locationImages: Image[],
  ): void {
    // Delete all images for company
    companyImages.forEach(img => {
      this.queue.add('delete-images', img, { attempts: 3 });
    });

    // For every location delete every image
    locationImages.forEach(img => {
      this.queue.add('delete-image', img, { attempts: 3 });
    });
  }
}
