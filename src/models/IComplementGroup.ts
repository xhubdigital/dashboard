import { IRestaurant } from './IRestaurant';
import { IProductInventoryItem } from './IInventoryItem';

export interface IComplementGroupOption {
  id?: string;
  label: string;
  price: number;
  position: number;
  picture?: string;
  status?: boolean;
  inventoryItems: IProductInventoryItem[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IComplementGroupToOption {
  id: string;
  position: number;
  productId: string;
}

export interface IComplementGroup {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  multiple: boolean;
  repeatOption: boolean;
  maxOptions: number;
  options: IComplementGroupOption[];
  connectedProducts: IComplementGroupToOption[];
  status: boolean;
  restaurant: IRestaurant;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IComplementGroupItem {
  id?: string;
  position?: number;
  complementGroup: IComplementGroup;
  complementGroupId: string;
  productId: string;
}

export interface ICreateComplementGroupOption {
  label: string;
  price: number;
  picture?: string;
}

export interface ICreateComplementGroup {
  label: string;
  description?: string;
  required: boolean;
  multiple: boolean;
  repeatOption: boolean;
  maxOptions: number;
  options: ICreateComplementGroupOption[];
}

export interface IUpdateComplementGroup {
  label: string;
  description?: string;
  required: boolean;
  multiple: boolean;
  repeatOption: boolean;
  maxOptions: number;
  options: ICreateComplementGroupOption[];
  status: boolean;
}
