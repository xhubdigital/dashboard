import { IAddress } from './IAddress';

export interface IServiceFee {
  id: string;
  range: number;
  waitingTime?: number;
  fee: number;
}

export interface IRestaurant {
  id: string;
  name: string;
  url: string;
  description?: string;
  banner?: string;
  picture?: string;
  deliveryTime: number;
  minimumOrder: number;
  address: IAddress;
  serviceFees: IServiceFee[];
}
