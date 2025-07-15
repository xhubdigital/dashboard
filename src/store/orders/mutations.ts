import { MutationTree } from 'vuex';
import moment from 'moment';

import { IOrder } from '@models/IOrder';

import { OrdersState } from './state';

const mutation: MutationTree<OrdersState> = {
  setLoadingOpenOrders(state: OrdersState, loading: boolean) {
    state.loadingOpenOrders = loading;
  },

  setOpenOrders(state: OrdersState, openOrders: IOrder[]) {
    state.openOrders = openOrders;
    state.openOrdersLastUpdated = moment();
  },

  updatePlayAudioOnAllPages(state: OrdersState, playOnAllPages: boolean) {
    state.playAudioOnAllPages = playOnAllPages;
  },
};

export default mutation;
