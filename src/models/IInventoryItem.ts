import { IInventoryItemHistory } from './IInventoryItemHistory';

export enum IInventoryItemUnit {
  Unit = 'unit',
  Liters = 'liters',
  Grams = 'grams',
  Kilos = 'kilos',
}

export interface IProductInventoryItem {
  id: string;
  productId: string;
  inventoryItemId: string | null;
  amount: number | null;
  price: number | null;
}

export interface IComplementOptionInventoryItem {
  id: string;
  complementGroupOptionId: string;
  inventoryItemId: string | null;
  amount: number | null;
  price: number | null;
}

export interface IInventoryItem {
  id: string;
  label: string;
  picture?: string;
  amount: number;
  price: number;
  unit: IInventoryItemUnit;
  history: IInventoryItemHistory[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface INewInventoryItem {
  label: string;
  picture?: string;
  unit: IInventoryItemUnit;
}
