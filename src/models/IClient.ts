export enum IClientOrigin {
  DELIVERY = 'delivery',
  MANUAL = 'manual',
  IFOOD = 'ifood',
  UBER_EATS = 'uber_eats',
  FOOD99 = '99food',
}

export interface IClient {
  id: string;
  origin: IClientOrigin;
  name: string;
  email: string;
  phone: string;
}
