import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'class-validator';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

/* */
/**
 * Pipe to get page for pagination
 * @example
 *   method(@Param('id', GetCompany) company: Company) {}
 */
@Injectable()
export class GetCompany implements PipeTransform<any> {
  constructor(private readonly service: CompanyService) {}

  private validator = new Validator();

  async transform(value: any): Promise<Company> {
    if (!this.validator.isString(value)) {
      throw new ForbiddenException('Invalid type.');
    }

    if (!this.validator.isUUID(value)) {
      throw new ForbiddenException('Invalid ID.');
    }
    const company = await this.service.findOne(value);
    return company;
  }
}
