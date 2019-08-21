import * as Faker from 'faker';
import { Company } from '../../src/company/company.entity';
import { Weekdays } from '../../src/company/location.dto';

const workhours: Record<Weekdays, string> = {
  monday: '09:00-21:00',
  tuesday: '09:00-21:00',
  wednesday: '09:00-21:00',
  thursday: '09:00-21:00',
  friday: '09:00-21:00',
  saturday: '09:00-18:00',
  sunday: '09:00-15:00'
};

export default function companyFactory() {
  const company = new Company();
  company.emails = [Faker.internet.email()];
  company.name = Faker.company.companyName();
  company.phoneNumbers = [Faker.phone.phoneNumber()];
  company.locations = [
    {
      cooridnates: {
        lat: Faker.address.latitude(),
        long: Faker.address.longitude()
      },
      address: Faker.address.streetAddress(),
      email: Faker.internet.email(),
      phoneNumber: Faker.phone.phoneNumber(),
      workingHours: workhours
    }
  ];

  return company;
}
