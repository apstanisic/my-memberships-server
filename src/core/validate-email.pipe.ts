import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';

@Injectable()
export class ValidateEmailPipe implements PipeTransform<string, string> {
  private validator = new Validator();

  transform(value: string): string {
    if (!this.validator.isEmail(value)) {
      throw new BadRequestException('Invalid email.');
    }
    return value;
  }
}
