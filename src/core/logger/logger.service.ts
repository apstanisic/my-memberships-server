import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { WithId } from '../types';
import { User } from '../../user/user.entity';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class LoggerService<T extends WithId = any> {
  constructor(
    @InjectRepository(Log) private readonly repository: Repository<Log>,
  ) {}

  init({
    oldValue,
    user,
    reason,
  }: {
    oldValue: any;
    user: User;
    reason?: string;
  }): Log<T> {
    const log = new Log<T>();
    log.executed.at = new Date();
    log.executed.by = user;
    log.executed.reason = reason;
    log.before = oldValue;
    log.entityId = oldValue.id;

    return log;
  }

  async store(log: Log, action: string): Promise<Log> {
    this.repository.merge(log, { action });
    return this.repository.save(log);
  }
}
