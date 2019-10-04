import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { CompanyService } from './company.service';
import { Company } from './company.entity';

/* */
/**
 * Pipe to get page for pagination
 * @example
 *   method(@Param('id', ValidUUID) id: string) {}
 */
@Injectable()
export class GetCompany implements PipeTransform<any, Promise<Company>> {
  constructor(private readonly service: CompanyService) {}

  private validator = new Validator();

  transform(value?: any): Promise<Company> {
    if (!this.validator.isString(value)) {
      throw new BadRequestException('Invalid type.');
    }

    if (!this.validator.isUUID(value)) {
      throw new BadRequestException('Invalid ID.');
    }
    return this.service.findOne(value);
  }
}
