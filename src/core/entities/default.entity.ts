import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Field, ID } from 'type-graphql';
import { Exclude, classToClass } from 'class-transformer';
import { validate } from 'class-validator';
import BaseException from '../BaseException';

/**
 * All entities should extend this class
 * Every entity must have these columns
 */
export abstract class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @CreateDateColumn()
  @Field()
  @Exclude()
  createdAt: Date;

  /* Validate fields */
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const error = await validate(this);
    if (error.length > 0) throw new BaseException({ error });
  }
}
