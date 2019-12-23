import * as Faker from 'faker';
import { CompanyImage } from './company-image.entity';
import { Company } from '../companies/company.entity';

const random = Faker.random.arrayElement;

/** @todo Not working currently */
export function generateUser(
  companies: Company[],
  position: number,
): CompanyImage {
  const image = new CompanyImage();
  image.company = random(companies);
  image.position = position;

  return image;
}
