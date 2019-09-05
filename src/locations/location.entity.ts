import {
  Column,
  Entity,
  ManyToOne,
  RelationId,
  OneToMany,
  IsNull,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsNumber,
} from 'class-validator';
import { Company } from '../company/company.entity';
import { Arrival } from '../arrivals/arrivals.entity';
import { BaseEntity } from '../core/entities/base.entity';
import { Workhours } from './workhours';

// In future maybe add number that represents position in
// globe, so it's less expensive to find near places
@Entity('locations')
export class Location extends BaseEntity {
  /** Company that is owner of this location */
  @ManyToOne(type => Company, company => company.locations)
  company: Company;

  /** Id of company that is owner of this location */
  // @RelationId((location: Location) => location.company)
  @Column()
  companyId: string;

  /** Arrivals at this location */
  @OneToMany(type => Arrival, arrival => arrival.location)
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
}
