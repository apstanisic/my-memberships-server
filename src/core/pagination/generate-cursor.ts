import { Base64 } from 'js-base64';
import { BadRequestException } from '@nestjs/common';
import { HasId } from '../interfaces';

/**
 * Returns
 * uuid;columnName;value in base64
 * @example
 *  some-uuid;createdAt;540918254
 */
export class GenerateCursor<T extends HasId = any> {
  /** Generated cursor */
  cursor: string;

  constructor(private entity: T, private column: string = 'createdAt') {
    this.generate();
  }

  private generate() {
    const value = this.getValue();
    this.cursor = Base64.encode(`${this.entity.id};${this.column};${value}`);
  }

  /** Get value from entity from provided column. Throw error if null value */
  private getValue() {
    const value = this.entity[this.column];
    if (value === undefined) {
      throw new BadRequestException(
        'Column either does not exist or is nullable',
      );
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    return value;
  }
}
