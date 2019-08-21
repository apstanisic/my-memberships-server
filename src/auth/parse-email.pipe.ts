import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';

@Injectable()
export class ValidateEmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const validate = new Validator();
    const valid = validate.isEmail(value);
    if (!valid) throw new BadRequestException();
    return value;
  }
}
