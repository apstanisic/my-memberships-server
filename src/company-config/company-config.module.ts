import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyConfig } from './company-config.entity';
import { CompanyConfigService } from './company-config.service';
import { CompanyConfigController } from './company-configs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyConfig])],
  controllers: [CompanyConfigController],
  providers: [CompanyConfigService],
  exports: [CompanyConfigService],
})
export class CompanyConfigsModule {}
