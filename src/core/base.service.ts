import { Repository, DeepPartial } from 'typeorm';
import {
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import parseQuery from './typeorm/parseQuery';
import { PaginationResponse, PgParams } from './pagination/pagination.types';
import { paginate } from './pagination/paginate.helper';

/**
 * Base service that implements some basic crud methods
 */
export abstract class BaseService<T = any> {
  protected abstract repository: Repository<T>;

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

  /** Find companies that match criteria */
  async findOne(criteria: any = {}): Promise<T> {
    let entity: T | undefined;
    try {
      entity = await this.repository.findOne({
        where: parseQuery(criteria),
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

  /** Find companies that match criteria */
  find(criteria: any = {}): Promise<T[]> {
    try {
      return this.repository.find({ where: parseQuery(criteria) });
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /** Find entities that match criteria with pagination */
  async paginate(
    criteria: any = {},
    pgParams: PgParams = {},
  ): PaginationResponse<T> {
    try {
      return paginate({
        criteria: parseQuery(criteria),
        options: pgParams,
        repository: this.repository,
      });
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /* Create new entity */
  async create(entity: DeepPartial<T>): Promise<T> {
    try {
      const createdEntity = await this.repository.create(entity);
      return this.repository.save(createdEntity);
    } catch (error) {
      throw new BadRequestException();
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
