import {
  ArrayMaxSize,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseEntity, Image } from 'nestjs-extra';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Arrival } from '../arrivals/arrivals.entity';
import { Company } from '../company/company.entity';
// import { BaseEntity } from '../core/entities/base.entity';
import { Workhours } from './workhours';
// import { Image } from '../core/types';

// In future maybe add number that represents position in
// globe, so it's less expensive to find near places
@Entity('locations')
export class Location extends BaseEntity {
  constructor() {
    super();
    this.images = [];
  }
  /** Company that is owner of this location */
  @ManyToOne(
    type => Company,
    company => company.locations,
  )
  company: Company;

  /** Id of company that is owner of this location */
  @Column()
  companyId: string;

  /** Name of location */
  @Length(3, 100)
  @Column({ nullable: true })
  name?: string;

  /** Arrivals at this location */
  @OneToMany(
    type => Arrival,
    arrival => arrival.location,
  )
  arrivals: Arrival[];

  /** This location address */
  @Column()
  @IsString()
  @Length(5, 200)
  address: string;

  /** Time this location is open */
  @Column({ type: 'simple-json', nullable: true })
  workingHours?: Workhours;

  /** This specific location phone number */
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(8, 30)
  phoneNumber?: string;

  /** This specific location email address */
  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Location latitude */
  @Column({ type: 'double precision', nullable: true })
  @IsOptional()
  @IsNumber()
  lat?: number;

  /** Location longitude */
  @Column({ type: 'double precision', nullable: true })
  @IsOptional()
  @IsNumber()
  long?: number;

  /** Path to images of this location. Currently 5 images max */
  @Column({ type: 'simple-json', default: [] })
  // @IsString({ each: true })
  @ArrayMaxSize(5)
  images: Image[];
}
