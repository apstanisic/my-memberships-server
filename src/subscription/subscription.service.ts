import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { BaseService } from '../core/base.service';

@Injectable()
export class SubscriptionService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription) repository: Repository<Subscription>,
  ) {
    super(repository);
  }
}
