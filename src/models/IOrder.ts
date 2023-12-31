import { IAddress } from './IAddress';
import { IClient } from './IClient';
import { IComplementGroup, IComplementGroupOption } from './IComplementGroup';
import { IProduct } from './IProduct';

export enum IOrderType {
  Delivery = 'delivery',
  Takeout = 'takeout',
  Local = 'local',
}

export enum IOrderStatus {
  Pending = 'pending',
  Cancelled = 'cancelled',
  Production = 'production',
  Delivery = 'delivery',
  Done = 'done',
}

export enum IOrderPaymentInfoType {
  CreditCardOnDelivery = 'credit-card-on-delivery',
  DebitCardOnDelivery = 'debit-card-on-delivery',
  MoneyOnDelivery = 'money-on-delivery',
}

export interface IOrderPaymentInfo {
  id: string;
  type: IOrderPaymentInfoType;
  changeFor?: number;
}

export interface IOrderItemComplementGroupOption {
  id: string;
  quantity: number;
  price: number;
  complementGroupOption: IComplementGroupOption;
}

export interface IOrderItemComplementItem {
  id: string;
  complementGroup: IComplementGroup;
  values: IOrderItemComplementGroupOption[];
}

export interface IOrderItem {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: IProduct;
  price: number;
  complements: IOrderItemComplementItem[];
  observations?: string;
}

export interface IOrder {
  id: string;
  client?: IClient;
  type: IOrderType;
  status: IOrderStatus;
  paymentInfo: IOrderPaymentInfo;
  address: IAddress;
  items: IOrderItem[];
  userName?: string;
  userPhone?: string;
  serviceFee: number;
  subTotal: number;
  expectedConclusion: Date;
  createdAt: Date;
}
