// Array must be const to infer type for RoleName
export const availableRoles = [
  'guest',
  'user',
  'admin',
  'owner',
  'app_admin',
  'app_owner',
] as const;

export type RoleName = typeof availableRoles[number];
