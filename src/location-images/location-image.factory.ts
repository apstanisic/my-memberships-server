import { plainToClass } from 'class-transformer';
import * as Faker from 'faker';
import { generateImage, Image } from 'nestjs-extra';
import { Location } from '../locations/location.entity';
import { LocationImage } from './location-image.entity';

const random = Faker.random.arrayElement;

/** Generate location image */
export function generateLocationImage(locations: Location[], position: number): LocationImage {
  const baseImage: Image = generateImage(position);
  const image = plainToClass(LocationImage, baseImage);
  image.location = random(locations);

  return image;
}
