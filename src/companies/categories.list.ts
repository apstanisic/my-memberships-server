// Array must be const to infer type for CompanyCategory
export const companiesCategories = [
  'Fitness',
  'Gym',
  'Library',
  'Martial Arts',
  'Dance',
  'Swimming',
] as const;

export type CompanyCategory = typeof companiesCategories[number];
