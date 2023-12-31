import { Moment } from 'moment';

import { IOrder } from '@models/IOrder';

export interface OrdersState {
  playAudioOnAllPages: boolean;
  loadingOpenOrders: boolean;
  openOrders: IOrder[];
  openOrdersLastUpdated: Moment | null;
}

function state(): OrdersState {
  return {
    playAudioOnAllPages: false,
    loadingOpenOrders: false,
    openOrders: [],
    openOrdersLastUpdated: null,
  };
}

export default state;
