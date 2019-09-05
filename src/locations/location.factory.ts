import * as Faker from 'faker';
import { Location } from './location.entity';
import { Company } from '../company/company.entity';

const workhours = {
  monday: '09:00-21:00',
  tuesday: '09:00-21:00',
  wednesday: '09:00-21:00',
  thursday: '09:00-21:00',
  friday: '09:00-21:00',
  saturday: '09:00-18:00',
  sunday: '09:00-15:00',
};

export function generateLocation(companies: Company[]) {
  const location = new Location();

  location.lat = Number(Faker.address.latitude());
  location.long = Number(Faker.address.longitude());
  location.address = Faker.address.streetAddress();
  location.email = Faker.internet.email();
  location.phoneNumber = Faker.phone.phoneNumber();
  location.workingHours = workhours;
  location.company = Faker.random.arrayElement(companies);

  return location;
}
