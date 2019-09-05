import { Repository, DeepPartial } from 'typeorm';
import {
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import parseQuery from './typeorm/parse-to-orm-query';
import { paginate } from './pagination/paginate.helper';
import { WithId } from './interfaces';
import { OrmWhere } from './types';
import { PgResult } from './pagination/pagination.types';
import { PaginationParams } from './pagination/pagination-options';

/** Params that can be provided to pagination */
interface PgMethodParams<T = any> {
  filter?: OrmWhere<T>;
  pg?: PaginationParams;
  parse?: boolean;
}

/**
 * Base service that implements some basic crud methods
 */
export abstract class BaseService<T extends WithId = any> {
  constructor(protected readonly repository: Repository<T>) {}

  private logger = new Logger();

  /* Find entity by id */
  async findById(id: string): Promise<T> {
    let entity: T | undefined;
    try {
      entity = await this.repository.findOne(id);
    } catch (error) {
      throw this.internalError(error);
    }
    return this.throwifNotFound(entity);
  }

  /**
   * Find companies that match criteria
   * @param parse Should query be parsed to TypeOrm
   * @example Left is passed value, right is parsed
   *  ({ price__lt: 5 } => { price: LessThan(5) })
   */
  async findOne(filter: OrmWhere<T>, parse = false): Promise<T> {
    let entity: T | undefined;
    try {
      entity = await this.repository.findOne({
        where: parse ? parseQuery(filter) : filter,
      });
    } catch (error) {
      throw this.internalError(error);
    }
    return this.throwifNotFound(entity);
  }

  findByIds(ids: string[]): Promise<T[]> {
    try {
      return this.repository.findByIds(ids);
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /**
   * Find companies that match criteria
   * @param parse Should query be parsed to TypeOrm specific
   */
  find(filter: OrmWhere<T> = {}, parse = true): Promise<T[]> {
    try {
      return this.repository.find({
        where: parse ? parseQuery(filter) : filter,
      });
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /**
   * Find entities that match criteria with pagination.
   * Pagination has it's own error handling. Don't handle errors twice
   */
  async paginate(options: PaginationParams<T>): PgResult<T> {
    const { repository } = this;
    return paginate({ options, repository });
  }

  /* Create new entity */
  async create(entity: DeepPartial<T>): Promise<T> {
    try {
      const createdEntity = this.repository.create(entity);
      const savedEntity = await this.repository.save(createdEntity);
      return savedEntity;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /* Remove entity */
  async delete(entityOrId: T | string): Promise<T> {
    try {
      const entity = await this.convertToEntity(entityOrId);
      return this.repository.remove(entity);
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /** Update entity */
  async update(entityOrId: T | string, data: DeepPartial<T> = {}): Promise<T> {
    const entity = await this.convertToEntity(entityOrId);
    try {
      this.repository.merge(entity, data);
      return this.repository.save(entity);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  /**
   * If provided entity return that entity,
   * if provided string it will try to find in db.
   * If not found throw an exception
   */
  private async convertToEntity(entityOrId: T | string) {
    let entity: T | undefined;
    if (typeof entityOrId === 'string') {
      entity = await this.repository.findOne(entityOrId);
      entity = this.throwifNotFound(entity);
    } else {
      entity = entityOrId;
    }
    return entity;
  }

  /** Throw exception if entity is undefined. Simple helper function */
  private throwifNotFound(entity: T | undefined) {
    if (!entity) throw new NotFoundException();
    return entity;
  }

  private internalError(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
