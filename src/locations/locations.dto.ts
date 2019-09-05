import {
  IsOptional,
  IsNumber,
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
  IsInstance,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Workhours } from './workhours';

class LocationDto {
  /** This location address */
  @IsString()
  address: string;

  /** Time this location is open */
  @Type(() => Workhours)
  @IsOptional()
  @IsInstance(Workhours)
  @ValidateNested()
  workingHours?: Workhours;

  /** This specific location phone number */
  @IsOptional()
  @IsString()
  @Length(8, 30)
  phoneNumber?: string;

  /** This specific location email address */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Location latitude */
  @Transform(v => (typeof v === 'string' ? parseFloat(v) : v))
  @IsOptional()
  @IsNumber()
  lat?: number;

  /** Location longitude */
  @Transform(v => (typeof v === 'string' ? parseFloat(v) : v))
  @IsOptional()
  @IsNumber()
  long?: number;
}

export class CreateLocationDto extends LocationDto {
  /** This location address */
  @IsNotEmpty()
  address: string;
}

export class UpdateLocationDto extends LocationDto {}
