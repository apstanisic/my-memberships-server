import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  getConnection,
} from 'typeorm';
import { Field, ID } from 'type-graphql';
import { Exclude, classToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BaseException } from '../custom-exceptions';

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

  /* Validate fields */
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const error = await validate(this);
    if (error.length > 0) throw new BaseException({ error });
  }
}
