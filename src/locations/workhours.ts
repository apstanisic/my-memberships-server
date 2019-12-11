import { IsString, IsNotEmpty } from 'class-validator';

/** Every day in week. Used for working hours */
export class Workhours {
  @IsNotEmpty()
  @IsString()
  monday?: string;

  @IsNotEmpty()
  @IsString()
  tuesday?: string;

  @IsNotEmpty()
  @IsString()
  wednesday?: string;

  @IsNotEmpty()
  @IsString()
  thursday?: string;

  @IsNotEmpty()
  @IsString()
  friday?: string;

  @IsNotEmpty()
  @IsString()
  saturday?: string;

  @IsNotEmpty()
  @IsString()
  sunday?: string;
}
