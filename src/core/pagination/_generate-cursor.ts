import { BadRequestException } from '@nestjs/common';
import { WithId } from '../types';

/**
 * Generate cursor from entity and column name
 * It will throw an error if entity does not have filed with column name
 * return uuid;columnName;value in base64
 * @example
 *  some-uuid;createdAt;540918254
 *
 */
export class GenerateCursor<T extends WithId = any> {
  /** Generated cursor */
  cursor: string;

  constructor(private entity: T, private column: string = 'createdAt') {
    if (this.entity.id === undefined) throw new BadRequestException('No id');
    const value = this.getColumnValueFromEntity();
    // Converts normal text to base64
    this.cursor = Buffer.from(
      `${this.entity.id};${this.column};${value}`,
      'ascii',
    ).toString('base64');
    //
  }

  /** Get value from entity from provided column. Throw error if null value */
  private getColumnValueFromEntity(): any {
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
