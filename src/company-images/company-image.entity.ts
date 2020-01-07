import { Image, UUID } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from '../companies/company.entity';

/** Image of company */
@Entity('company_images')
export class CompanyImage extends Image {
  @ManyToOne(
    type => Company,
    company => company.images,
    { onDelete: 'CASCADE' },
  )
  company: Company;

  @Column()
  companyId: UUID;
}
