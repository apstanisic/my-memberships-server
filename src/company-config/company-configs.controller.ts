import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard, GetUser, PermissionsGuard, UUID, ValidUUID } from 'nestjs-extra';
import { User } from '../users/user.entity';
import { CompanyConfigService } from './company-config.service';

@Controller('companies/:companyId/config')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class CompanyConfigController {
  constructor(private readonly companyConfigService: CompanyConfigService) {}

  @Get()
  getConfig(@Param('companyId', ValidUUID) companyId: UUID, @GetUser() user: User): any {
    return this.companyConfigService.getConfig(companyId);
  }
}
