import { Repository, DeepPartial, DeleteResult } from 'typeorm';
import parseQuery from './typeorm/parseQuery';
import { PaginationResponse, PgParams } from './pagination/pagination.types';
import { paginate } from './pagination/paginate.helper';

/**
 * Base service that implements some basic crud methods
 */
export abstract class BaseService<T = any> {
  protected abstract repository: Repository<T>;

  /* Find entity by id */
  findById(id: string): Promise<T> {
    return this.repository.findOneOrFail(id);
  }

  /** Find companies that match criteria */
  findOne(criteria: any = {}): Promise<T> {
    return this.repository.findOneOrFail({ where: parseQuery(criteria) });
  }

  /** Find companies that match criteria */
  find(criteria: any = {}): Promise<T[]> {
    return this.repository.find({ where: parseQuery(criteria) });
  }

  /** Find entities that match criteria with pagination */
  async paginate(
    criteria: any = {},
    pgParams: PgParams = {},
  ): PaginationResponse<T> {
    return paginate({
      criteria: parseQuery(criteria),
      options: pgParams,
      repository: this.repository,
    });
  }

  /* Create new entity */
  async create(entity: DeepPartial<T>): Promise<T> {
    const createdEntity = await this.repository.create(entity);
    return this.repository.save(createdEntity);
  }

  /* Remove entity */
  async delete(entityOrId: T | string): Promise<T> {
    const entity = await this.convertToEntity(entityOrId);
    return this.repository.remove(entity);
  }

  /** Update entity */
  async update(entityOrId: T | string, data: DeepPartial<T> = {}): Promise<T> {
    const entity = await this.convertToEntity(entityOrId);
    this.repository.merge(entity, data);
    return this.repository.save(entity);
  }

  private async convertToEntity(entityOrId: T | string) {
    let entity: T;
    if (typeof entityOrId === 'string') {
      entity = await this.repository.findOneOrFail(entityOrId);
    } else {
      entity = entityOrId;
    }
    return entity;
  }
}
