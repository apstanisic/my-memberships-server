import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';

/* */
/**
 * Pipe to get page for pagination
 * @example
 *   method(@Param('id', ValidUUID) id: string) {}
 */
@Injectable()
export class ValidUUID implements PipeTransform<string, string> {
  private validator = new Validator();

  transform(value: string): string {
    if (!this.validator.isUUID(value)) {
      throw new BadRequestException('Invalid ID.');
    }
    return value;
  }
}
