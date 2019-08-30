import { PipeTransform, Injectable } from '@nestjs/common';

/* */
/**
 * Pipe to get page for pagination
 * @example
 *   method(@Query(GetPage) page: int) {}
 * @todo Check if this works
 */
@Injectable()
export class GetPage implements PipeTransform<Record<string, any>, number> {
  transform(value: Record<string, any>): number {
    const page = parseInt(value.page, 10);
    if (Number.isNaN(page) || page < 1) return 1;
    return page;
  }
}
