import * as Faker from 'faker';
import { Company } from './company.entity';
import { User } from '../user/user.entity';
import { companiesCategories } from './categories.list';
import { generateLocation } from '../locations/location.factory';

export function generateCompany(users: User[]) {
  const company = new Company();
  company.emails = [Faker.internet.email().toLowerCase()];
  company.name = Faker.company.companyName();
  company.phoneNumbers = [Faker.phone.phoneNumber()];
  company.description = Faker.lorem.paragraph(4);
  company.category = Faker.random.arrayElement(companiesCategories as any);
  company.locations = Array(4).map(() => generateLocation([company]));
  company.owner = Faker.random.arrayElement(users);

  return company;
}
