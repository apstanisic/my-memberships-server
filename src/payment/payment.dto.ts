import { IsInt, IsUUID } from 'class-validator';
import { IsBetween } from 'nestjs-extra';
// import { IsBetween } from '../core/is-between';

/** Params provided when adding or subtracting company credit */
export class ChangeCreditDto {
  /** How much was it paid */
  @IsInt()
  @IsBetween(0, 100000)
  price: number;

  /** How much credit was it added */
  @IsInt()
  @IsBetween(-100000, 100000)
  credit: number;

  @IsUUID()
  companyId: string;
}
