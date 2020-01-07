import { plainToClass } from 'class-transformer';
import * as Faker from 'faker';
import { Image, generateImage } from 'nestjs-extra';
import { Company } from '../companies/company.entity';
import { CompanyImage } from './company-image.entity';

const random = Faker.random.arrayElement;

/** Generate company image */
export function generateCompanyImage(companies: Company[], position: number): CompanyImage {
  const baseImage: Image = generateImage(position);
  const image = plainToClass(CompanyImage, baseImage);
  image.company = random(companies);

  return image;
}
