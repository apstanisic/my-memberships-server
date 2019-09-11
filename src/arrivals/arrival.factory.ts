import * as Faker from 'faker';
import { Arrival } from './arrivals.entity';
import { Company } from '../company/company.entity';

export function generateArrival(companies: Company[]): Arrival {
  const random = Faker.random.arrayElement;
  const company = random(companies);

  const arrival = new Arrival();

  arrival.lat = Number(Faker.address.latitude());
  arrival.long = Number(Faker.address.longitude());
  arrival.address = Faker.address.streetAddress();
  arrival.arrivedAt = new Date();
  arrival.subscription = random(company.subscriptions);
  arrival.location = random(company.locations);

  return arrival;
}
