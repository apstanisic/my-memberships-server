import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseEntity } from 'nestjs-extra';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Arrival } from '../arrivals/arrival.entity';
import { Company } from '../companies/company.entity';
import { LocationImage } from '../location-images/location-image.entity';
import { Workhours } from './workhours';

/**
 * @Todo Maybe store special number of combined lat & long.
 * That way it's easier to find near locations.
 * Maybe don't do anything.
 * @Todo Maybe improve storing of working hours.
 * Or validate them at least
 */
@Entity('locations')
export class Location extends BaseEntity {
  /** Company that is owner of this location */
  @ManyToOne(
    type => Company,
    company => company.locations,
    { onDelete: 'CASCADE' },
  )
  company: Company;

  /** Id of company that is owner of this location */
  @Column()
  companyId: string;

  /** Location name */
  @Length(3, 100)
  @Column({ nullable: true })
  name?: string;

  /** Arrivals at this location */
  @OneToMany(
    type => Arrival,
    arrival => arrival.location,
  )
  arrivals: Arrival[];

  /** Address */
  @Column()
  @IsString()
  @Length(5, 200)
  address: string;

  /** Time this location is open */
  @Column({ type: 'jsonb', nullable: true })
  workingHours?: Workhours;

  /** Phone number of this location */
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(8, 30)
  phoneNumber?: string;

  /** Email of this location */
  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Latitude */
  @Column({ type: 'double precision', nullable: true })
  @IsOptional()
  @IsNumber()
  lat?: number;

  /** Longitude */
  @Column({ type: 'double precision', nullable: true })
  @IsOptional()
  @IsNumber()
  long?: number;

  /** Images */
  @OneToMany(
    type => LocationImage,
    image => image.location,
  )
  images: LocationImage[];
}
