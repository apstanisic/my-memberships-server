export interface Weekdays {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

// In future maybe add number that represents position in
// globe, so it's less expensive to find near places
export interface Location {
  address: string;
  workingHours?: Weekdays;
  phoneNumber?: string;
  email?: string;
  lat: number;
  long: number;
}
