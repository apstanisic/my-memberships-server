import { Image, UUID } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity('company_images')
export class CompanyImage extends Image {
  @ManyToOne(
    type => Company,
    company => company.images,
  )
  company: Company;

  @Column()
  companyId: UUID;
}
