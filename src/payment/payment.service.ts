import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';
import { BaseService } from '../core/base.service';
import { UUID } from '../core/types';
import { User } from '../user/user.entity';
import { PaymentRecord } from './payment-record.entity';
import { Tier } from '../company/payment-tiers.list';

interface ChangeCreditParams {
  companyId: UUID;
  price: number;
  credit: number;
  user: User;
}

@Injectable()
export class PaymentService extends BaseService<PaymentRecord> {
  constructor(
    @InjectRepository(PaymentRecord) repository: Repository<PaymentRecord>,
    private readonly companyService: CompanyService,
  ) {
    super(repository);
  }

  /** Add or substract credit from company */
  async changeCredit({
    companyId,
    credit,
    price,
    user,
  }: ChangeCreditParams): Promise<number> {
    const company = await this.companyService.findOne(companyId);
    // Create payment record
    await this.create(
      { company, price, creditAdded: credit, appAdmin: user },
      { user, reason: 'Change credit', domain: company.id },
    );

    const newCredit = company.credit + credit;
    await this.companyService.update(
      company,
      { credit: newCredit },
      { user, reason: 'Change credit' },
    );
    return company.credit;
  }

  // /** Set credit for company */
  // async replaceCredit(
  //   companyId: UUID,
  //   amount: number,
  //   user: User,
  // ): Promise<number> {
  //   const company = await this.companyService.findOne(companyId);
  //   await this.companyService.update(
  //     company,
  //     { credit: amount },
  //     { user, reason: 'Set credit' },
  //   );
  //   return company.credit;
  // }
}
