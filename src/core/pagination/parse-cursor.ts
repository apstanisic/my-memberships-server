import { Base64 } from 'js-base64';
import { BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { MoreThan, LessThan, FindOperator } from 'typeorm';

/** Parse cursor to proper where query part */
export class ParseCursor<T = any> {
  validator = new Validator();

  parsed: Record<string, FindOperator<T>> = {};

  columnName: string;

  columnValue: any;

  id: string;

  constructor(private cursor?: string, private order: 'ASC' | 'DESC' = 'DESC') {
    const parsed = this.parse();
    if (parsed !== undefined) this.parsed = parsed;
  }

  private parse(): { [key: string]: FindOperator<any> } | undefined {
    // Do nothing if cursor is not defined
    if (!this.cursor) return;
    // Decode cursor if exists
    const decodedCursor = Base64.decode(this.cursor);
    // Split cursor so we can get order column and id
    // Id is required to ensure unique order
    const [firstPart, id] = decodedCursor.split(';');
    if (!id) throw new BadRequestException('Id part of cursor not provided');
    this.id = id;
    return {
      ...this.parseFirstPart(firstPart),
      ...this.parseSecondPart(),
    };
  }

  private parseSecondPart() {
    if (!this.validator.isUUID(this.id)) {
      throw new BadRequestException('Cursor Id part not UUID');
    }
    /* eslint-disable no-else-return */
    if (this.order === 'ASC') {
      return { id: MoreThan(this.id) };
    } else {
      return { id: LessThan(this.id) };
    }
  }

  /**
   * First part can have 3 fields
   * First is column name
   * Second is value
   * And third is type to which value should be parsed
   * If type not provided it will keep as string.
   * If value ends with At it will convert to Date
   */
  private parseFirstPart(cursor1: string) {
    const [column, value, type] = cursor1.split('__');
    this.columnName = column;
    this.columnValue = value;
    if (!this.validator.isNotEmpty(value)) {
      throw new BadRequestException('Pagination value can not be empty');
    }

    // Convert to proper type.
    // If column name ends with At assume it's a date and convert
    let parsedValue;
    if (type === 'number') {
      parsedValue = Number(value);
    } else if (type === 'date' || column.endsWith('At')) {
      if (this.validator.isNumberString(value)) {
        parsedValue = new Date(Number(value));
      } else {
        parsedValue = new Date(value);
      }
    } else {
      parsedValue = value;
    }

    // let parsedValue: any = column.endsWith('At') ? new Date(value) : value;
    // Inplement order
    if (this.order === 'ASC') {
      parsedValue = MoreThan(parsedValue);
    } else {
      parsedValue = LessThan(parsedValue);
    }
    return { [column]: parsedValue };
  }
}
