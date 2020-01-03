import { IsString, IsNotEmpty } from 'class-validator';

/** Every day in week. Used for working hours */
export class Workhours {
  @IsString()
  monday?: string;

  @IsString()
  tuesday?: string;

  @IsString()
  wednesday?: string;

  @IsString()
  thursday?: string;

  @IsString()
  friday?: string;

  @IsString()
  saturday?: string;

  @IsString()
  sunday?: string;
}
