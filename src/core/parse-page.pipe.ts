import { PipeTransform, Injectable } from '@nestjs/common';

/* Pipe to get page for pagination */
@Injectable()
export class GetPage implements PipeTransform<string, number> {
  transform(value: string): number {
    const page = parseInt(value, 10);
    if (isNaN(page) || page < 1) {
      return 1;
    }
    return page;
  }
}
