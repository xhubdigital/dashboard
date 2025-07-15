import { IProduct } from './IProduct';

export interface IProductCategory {
  id: string;
  label: string;
  position: number;
  status: boolean;
  products: IProduct[];
}
