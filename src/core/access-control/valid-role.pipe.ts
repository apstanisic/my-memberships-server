import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { availableRoles } from './roles.list';

/**
 * Get correct role from request
 * @example
 *   method(@Param('id', ValidRole) role: RoleName) {}
 */
@Injectable()
export class ValidRole implements PipeTransform<string, string> {
  private validator = new Validator();

  transform(value: string): string {
    const roles = Array.from(availableRoles);

    if (!this.validator.isString(value) || !this.validator.isIn(value, roles)) {
      throw new BadRequestException('Role does not exist');
    }

    return value;
  }
}
