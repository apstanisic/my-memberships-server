import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { BaseEntity, IsBetween, UUID } from 'nestjs-extra';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Optional } from '@nestjs/common';
import { Company } from '../companies/company.entity';

/**
 * Shape of config
 *
 * config {
 *   version
 *   companyId
 *   config {
 *     subscription {
 *       types {
 *         name
 *         price
 *         duration
 *         durationUnit
 *         allowedUses
 *       }
 *     }
 *   }
 * }
 */

class SubscriptionType {
  @Length(1, 50)
  name: string;

  @IsInt()
  @IsBetween(0, 1_000_000)
  price: number;

  @IsNumber()
  @IsBetween(0, 10000)
  duration: number;

  @IsString()
  @Length(1, 20)
  durationUnit: string;

  @IsOptional()
  @IsInt()
  @IsBetween(0, 10000)
  allowedUses?: number;
}

class SubscriptionConfig {
  @ValidateNested()
  types: Record<string, SubscriptionType>;
}

class Configs {
  @ValidateNested()
  subscription?: SubscriptionConfig;
}

@Entity('company_configs')
export class CompanyConfig extends BaseEntity {
  @IsInt()
  @Column()
  version: number;

  @OneToOne(
    type => Company,
    company => company.config,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  company: Company;

  @Column()
  companyId: UUID;

  @Column({ type: 'jsonb', default: {} })
  @Optional()
  @ValidateNested()
  config?: Configs;
}
