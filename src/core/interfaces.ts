/** Provided object must have Id and can have any other fields */
export interface WithId {
  id: string;
  [key: string]: any;
}
