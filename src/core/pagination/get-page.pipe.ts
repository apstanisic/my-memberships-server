import { PipeTransform, Injectable } from '@nestjs/common';
import { pageField } from './pagination-query-fields';

/* */
/**
 * Pipe to get page for pagination
 * Pass whole query, it will detect
 * @example
 *   method(@Query(GetPage) page: int) {}
 * @todo Check if this works
 */
@Injectable()
export class GetPage implements PipeTransform<Record<string, any>, number> {
  transform(value: Record<string, any>): number {
    const page = parseInt(value[pageField], 10);
    if (Number.isNaN(page) || page < 1) return 1;
    return page;
  }
}
