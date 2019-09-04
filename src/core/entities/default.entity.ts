import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { Field, ID } from 'type-graphql';
import {
  Exclude,
  plainToClassFromExist,
  classToPlain,
  classToClass,
} from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

/**
 * All entities should extend this class
 * Every entity must have these columns
 */
@Index(['createdAt', 'id'])
export abstract class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Exclude()
  updatedAt: Date;

  /** Created At has index for cursor pagination */
  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  @Field()
  // @Exclude()
  createdAt: Date;

  /** Validate fields
   * @todo Fix this. I think there is no need for this much casting
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    let errors = await validate(this);

    errors = errors.map(({ target, ...other }) => {
      const clonedThis = classToClass(this);
      const classTarget = plainToClassFromExist(clonedThis, target);
      const safeTarget = classToPlain(classTarget);

      return { ...other, target: safeTarget };
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
