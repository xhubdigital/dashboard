import { IUser } from './IUser';

export interface IInventoryItemHistory {
  id: string;
  variation: number;
  price: number;
  oldAmount: number;
  orderId?: string;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
