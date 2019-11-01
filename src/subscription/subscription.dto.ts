import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsPositive,
  IsDefined,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { UUID } from 'nestjs-extra';

class SubscriptionDto {
  @Type(() => Date)
  @IsDate()
  startsAt?: Date;

  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  allowedUses: number;
}

export class CreateSubscriptionDto extends SubscriptionDto {
  @IsDefined()
  @IsUUID()
  companyId: string;

  @IsDefined()
  startsAt: Date = new Date();

  @IsDefined()
  expiresAt: Date;

  @IsDefined()
  price: number;

  @IsDefined()
  allowedUses: number = 31;

  @IsDefined()
  ownerId: UUID;
}

export class UpdateSubscriptionDto extends SubscriptionDto {
  @IsOptional()
  startsAt?: Date;

  @IsOptional()
  expiresAt?: Date;

  @IsOptional()
  price: number;

  @IsOptional()
  allowedUses: number;
}
