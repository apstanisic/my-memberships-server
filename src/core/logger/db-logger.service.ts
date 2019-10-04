import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { WithId, OrmWhere } from '../types';
import { LogMetadata } from './log-metadata';
import { BaseService, FindManyParams } from '../base.service';
import { PaginationParams } from '../pagination/pagination-options';
import { PgResult } from '../pagination/pagination.types';
import { parseQuery } from '../typeorm/parse-to-orm-query';
import { paginate } from '../pagination/_paginate.helper';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class DbLoggerService<T extends WithId = any> {
  constructor(
    @InjectRepository(Log, 'log_db')
    private readonly repository: Repository<Log>,
  ) {}

  /**
   * Initialize log. This will create log entity, and fill some fields.
   * @warning This will not save log in database. You must use store.
   */
  generateLog({ oldValue, meta }: { oldValue?: T; meta: LogMetadata }): Log<T> {
    const { domain, user: by, reason } = meta;
    const log = new Log<T>();
    log.domainId = typeof domain === 'object' ? domain.id : domain;
    log.executedBy = by;
    log.reason = reason;
    log.initialValue = oldValue;
    if (oldValue) {
      log.entityId = oldValue.id;
    }

    return log;
  }

  /** Store provided log to database */
  async store(log: Log, action: string, newValue?: T): Promise<Log> {
    log.action = action;
    log.newValue = newValue;
    return this.repository.save(log);
  }

  /** Find all logs that match criteria */
  async find(filter: OrmWhere<T> = {}): Promise<Log[]> {
    try {
      const res = await this.repository.find({
        where: parseQuery(filter),
      });
      return res;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Paginate logs. Copy of baseService.paginate. Can't extend that class
   * because that class contains references to this class.
   */
  async paginate(
    options: PaginationParams<Log>,
    where?: OrmWhere<Log>,
  ): PgResult<Log> {
    const { repository } = this;
    const combinedOptions = { ...options };

    if (
      typeof combinedOptions.where === 'object' &&
      typeof where === 'object'
    ) {
      combinedOptions.where = { ...combinedOptions.where, ...where };
    } else if (typeof where === 'object') {
      combinedOptions.where = where;
    }
    combinedOptions.where = parseQuery(combinedOptions.where);

    const paginated = await paginate({ repository, options: combinedOptions });
    return paginated;
  }
}
