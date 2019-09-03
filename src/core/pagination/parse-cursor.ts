import { Base64 } from 'js-base64';
import { BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { FindOperator, Raw } from 'typeorm';
import { escape as e } from 'sqlstring';
import { HasId } from '../interfaces';
import { InternalError } from '../custom-exceptions';

/** Parse cursor to proper where query part */
export class ParseCursor<T extends HasId = any> {
  /** Part of TypeOrm query used for pagination */
  query: { [key: string]: FindOperator<any> };

  /** Validate values */
  private validator = new Validator();

  /** UUID from cursor (1st param) */
  private id: string;

  /** Column name from cursor (2nd param) */
  private columnName: string;

  /** Column value from cursor (3nd param) */
  private columnValue: any;

  /**
   * @param cursor that needs to be parsed
   * @param order that db will use to sort.
   * It will use column from columnName property
   */
  constructor(private cursor: string, private order: 'ASC' | 'DESC' = 'DESC') {
    const decodedCursor = Base64.decode(this.cursor);
    // Split cursor so we can get id, column and value, and maybe type
    const [id, columnName, columnValue, type] = decodedCursor.split(';');
    if (this.validator.isEmpty(columnValue)) throw new BadRequestException();

    this.id = id;
    this.columnName = columnName;
    this.columnValue = columnValue;

    this.convertValueToCorrectType(type);
    this.query = this.toTypeOrmQuery();
    // this.query = this.parsedValue;
  }

  /** Parse cursor to TypeOrm query item */
  private toTypeOrmQuery() {
    // Id must be valid UUID
    if (!this.validator.isUUID(this.id)) {
      throw new BadRequestException("Cursor's Id part not UUID");
    }

    // Sign to be use in cursor query. Order is passed in constructor
    // If ascending order use >, if descending use <
    const sign = this.order === 'ASC' ? '>' : '<';

    // Where part in case query value is different then provided cursor value
    const valueIsDiff = (column: string) =>
      `${column} ${sign} ${e(this.columnValue)}`;

    // Where part in case query value is same as provided cursor value
    const valueIsEqual = (column: string) =>
      `${column} = ${e(this.columnValue)}`;
    return {
      [this.columnName]: Raw(alias => {
        if (!alias) throw new InternalError('Column name empty');
        return `( ${valueIsDiff(alias)} OR ( ${valueIsEqual(
          alias,
        )} AND id ${sign} ${e(this.id)}) )`;
      }),
    };
  }

  /** Parse value to TypeOrm query item */
  private convertValueToCorrectType(type?: string) {
    // If column name ends with At assume it's a date and convert
    let converted;
    if (type === 'number') {
      converted = Number(this.columnValue);
    } else if (this.columnName.endsWith('At')) {
      // If number check if value is timestamp or iso time
      if (this.validator.isNumberString(this.columnValue)) {
        converted = new Date(Number(this.columnValue));
      } else {
        converted = new Date(this.columnValue);
      }
    } else {
      // Else simply use string
      converted = this.columnValue;
    }

    this.columnValue = converted;
  }
}
