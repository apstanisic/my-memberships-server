import {
  Repository,
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';
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
import { SoftDelete } from './entities/soft-delete.interface';
import { User } from '../user/user.entity';

type FindOneParams<T> = Omit<FindOneOptions<T>, 'where'>;
type FindManyParams<T> = Omit<FindManyOptions<T>, 'where'>;

/**
 * Base service that implements some basic crud methods
 */
export abstract class BaseService<T extends WithId = any> {
  constructor(protected readonly repository: Repository<T>) {}

  private logger = new Logger();

  /**
   * Find companies that match criteria
   * @param parse Should query be parsed to TypeOrm
   * @example Left is passed value, right is parsed
   *  ({ price__lt: 5 } => { price: LessThan(5) })
   */
  async findOne(
    filter: OrmWhere<T>,
    options: FindOneParams<T> = {},
    parse = false,
  ): Promise<T> {
    let entity: T | undefined;
    let where;

    if (parse) {
      where = parseQuery(filter);
    } else if (typeof filter === 'string' || typeof filter === 'number') {
      where = { id: filter };
    } else {
      where = filter;
    }

    try {
      entity = await this.repository.findOne({ ...options, where });
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
   * You can pass where query in options object or as a second param
   */
  async paginate(
    options: PaginationParams<T>,
    where?: OrmWhere<T>,
  ): PgResult<T> {
    const { repository } = this;
    const combinedOptions = { ...options };
    if (where) {
      if (
        typeof combinedOptions.where === 'object' &&
        typeof where === 'object'
      ) {
        combinedOptions.where = { ...combinedOptions.where, ...where };
      } else {
        combinedOptions.where = where;
      }
    }

    return paginate({ repository, options: combinedOptions });
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

  /** Remove entity */
  async delete(entityOrId: T | string, userForsoftDelete?: User): Promise<T> {
    try {
      const entity = await this.convertToEntity(entityOrId);
      if (this.canSoftDelete(entity) && userForsoftDelete) {
        entity.deleted.at = new Date();
        entity.deleted.by = userForsoftDelete;
        return this.update(entity);
      }
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

  async count(
    filter: OrmWhere<T>,
    options: FindManyParams<T> = {},
    parse = false,
  ): Promise<number> {
    try {
      return this.repository.count({
        ...options,
        where: parse ? parseQuery(filter) : filter,
      });
    } catch (error) {
      throw this.internalError(error);
    }
  }

  /**
   * If provided entity return that entity,
   * if provided string it will try to find in db.
   * If not found throw an exception
   */
  protected async convertToEntity(entityOrId: T | string) {
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
  protected throwifNotFound(entity: T | undefined) {
    if (!entity) throw new NotFoundException();
    return entity;
  }

  protected internalError(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException();
  }

  /** Check if entity can be soft deleted */
  private canSoftDelete(entity: Record<string, any>): entity is SoftDelete {
    return typeof entity === 'object' && typeof entity.deleted === 'object';
  }
}
