import { IProductCategory } from './IProductCategory';
import { IComplementGroupItem } from './IComplementGroup';
import { IProductInventoryItem } from './IInventoryItem';

export interface IProduct {
  id: string;
  label: string;
  description?: string;
  picture?: string;
  price: number;
  position: number;
  status: boolean;
  categoryId: string;
  category: IProductCategory;
  complementGroups: IComplementGroupItem[];
  inventoryItems: IProductInventoryItem[];
}
