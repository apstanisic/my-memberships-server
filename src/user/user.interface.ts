/** User must always have this fields */
export interface IUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  confirmed: boolean;
  secureToken?: string;
  tokenCreatedAt?: Date;
  password: string;
  checkPassword: (password: string) => Promise<boolean> | boolean;
}
