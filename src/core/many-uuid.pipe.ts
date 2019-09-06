import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { UUID } from './types';

/* */
/**
 * Pipe to get page for pagination
 * @example
 *   method(@Query('ids', ManyUUID) ids: UUID[]) {}
 */
@Injectable()
export class ManyUUID implements PipeTransform<string, UUID[]> {
  private validator = new Validator();

  transform(value: string): UUID[] {
    let ids;
    try {
      ids = JSON.parse(value);
    } catch (error) {
      throw new BadRequestException();
    }

    if (!Array.isArray(ids)) throw new BadRequestException();

    const valid = ids.every(id => this.validator.isUUID(id));
    if (!valid) throw new BadRequestException();

    return ids;
  }
}
