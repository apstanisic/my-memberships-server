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

export function generateLocation(companies: Company[]): Location {
  const location = new Location();

  location.name = Faker.address.city();
  location.lat = Number(Faker.address.latitude());
  location.long = Number(Faker.address.longitude());
  location.address = Faker.address.streetAddress();
  location.email = Faker.internet.email().toLowerCase();
  location.phoneNumber = Faker.phone.phoneNumber();
  location.workingHours = workhours;
  location.company = Faker.random.arrayElement(companies);
  location.images = [];
  for (let i = 0; i < Math.random() * 5; i += 1)
    location.images.push({
      id: Faker.random.uuid(),
      position: i,
      prefix: Faker.random.uuid(),
      sizes: {
        lg: 'https://placeimg.com/1000/1000/nature',
        md: 'https://placeimg.com/640/640/nature',
        sm: 'https://placeimg.com/320/320/nature',
        xs: 'https://placeimg.com/128/128/nature',
      },
    });

  return location;
}
