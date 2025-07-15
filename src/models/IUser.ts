import { IRestaurant } from './IRestaurant';

export enum UserRole {
  Admin = 'admin',
  Cashier = 'cashier',
  Client = 'client',
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
  restaurant: IRestaurant;
}
