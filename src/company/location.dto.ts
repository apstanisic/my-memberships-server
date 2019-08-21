export interface Location {
  address: string;
  workingHours?: Record<Weekdays, string>;
  phoneNumber?: string;
  email?: string;
  cooridnates?: {
    lat: string;
    long: string;
  };
}

export type Weekdays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
