import * as Faker from 'faker';
import moment from 'moment';
import { Company } from '../companies/company.entity';
import { Arrival } from './arrival.entity';

export function generateArrival(companies: Company[]): Arrival {
  const random = Faker.random.arrayElement;
  const company = random(companies);

  const arrival = new Arrival();

  arrival.lat = Number(Faker.address.latitude());
  arrival.long = Number(Faker.address.longitude());
  arrival.address = Faker.address.streetAddress();
  arrival.arrivedAt = new Date();
  arrival.arrivedAt = moment()
    .add(Math.ceil(Math.random() * 90) + 20, 'minute')
    .toDate();
  arrival.subscription = random(company.subscriptions);
  arrival.userId = arrival.subscription.ownerId;
  arrival.location = random(company.locations);
  arrival.company = company;

  return arrival;
}
