import { Image, UUID } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from '../companies/company.entity';

/**
 * @todo Delete image on entity deletion
 * Not possible with BeforeDelete because it's
 * deleting by cascade. Must be done with triggers.
 */
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
