import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cloneDeep } from 'lodash';
import { BaseService, UUID } from 'nestjs-extra';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { CompanyConfig } from './company-config.entity';

export class CompanyConfigService extends BaseService<CompanyConfig> {
  constructor(@InjectRepository(CompanyConfig) repository: Repository<CompanyConfig>) {
    super(repository);
  }

  getConfig(companyId: UUID): Promise<CompanyConfig> {
    return this.findOne({ companyId });
  }

  @Transaction({ isolation: 'SERIALIZABLE' })
  updateConfig(
    { config, companyId }: any,
    @TransactionManager() em?: EntityManager,
  ): Promise<CompanyConfig> {
    if (!em) throw new InternalServerErrorException();
    const configService = new BaseService(em.getRepository(CompanyConfig));
    return configService.updateWhere({ companyId }, { config });
  }

  async resetToDefault(companyId: UUID): Promise<any> {
    const config = await this.findOne({ companyId });
    const clonedConfig = cloneDeep(config);
    clonedConfig.config = {};
    this.update(config.id, clonedConfig);
  }
}
