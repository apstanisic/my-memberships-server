import {
  IsOptional,
  IsNumber,
  IsString,
  Length,
  IsEmail,
  IsInstance,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Workhours } from './workhours';

/** Common data for both creating and updating locations. */
class LocationDto {
  /** Location's name */
  @Length(3, 100)
  name?: string;

  /** This location address */
  @IsString()
  @Length(4, 200)
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

/** Data when creating location. It extends common properties. */
export class CreateLocationDto extends LocationDto {
  @IsDefined()
  address: string;

  @IsDefined()
  name: string;
}

/** Data when updating location. It extends common properties. */
export class UpdateLocationDto extends LocationDto {
  @IsOptional()
  address: string;

  @IsOptional()
  name: string;
}
