import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class Cooridnates {
  @Field()
  lat: string;

  @Field()
  long: string;
}

@ObjectType()
export class Weekdays {
  @Field()
  monday: string;

  @Field()
  tuesday: string;

  @Field()
  wednesday: string;

  @Field()
  thursday: string;

  @Field()
  friday: string;

  @Field()
  saturday: string;

  @Field()
  sunday: string;
}

@ObjectType()
export class Location {
  @Field()
  address: string;

  @Field((type) => Weekdays)
  workingHours?: Weekdays;

  @Field()
  phoneNumber?: string;

  @Field()
  email?: string;

  @Field((type) => Cooridnates)
  cooridnates?: {
    lat: string;
    long: string;
  };
}
