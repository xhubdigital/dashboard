import { GetterTree } from 'vuex';
import { filter, propEq } from 'ramda';

import { IOrderStatus } from '@models/IOrder';

import { StateInterface } from '../index';
import { OrdersState } from './state';

const getters: GetterTree<OrdersState, StateInterface> = {
  loadingOpenOrders(context) {
    return context.loadingOpenOrders;
  },

  openOrders(context) {
    return context.openOrders;
  },

  pendingOrders(context) {
    return filter(propEq('status', IOrderStatus.Pending), context.openOrders);
  },

  inProductionOrders(context) {
    return filter(
      propEq('status', IOrderStatus.Production),
      context.openOrders,
    );
  },

  inDeliveryOrders(context) {
    return filter(propEq('status', IOrderStatus.Delivery), context.openOrders);
  },

  playAudioOnAllPages(context) {
    return context.playAudioOnAllPages;
  },

  openOrdersLastUpdated(context) {
    return context.openOrdersLastUpdated;
  },
};

export default getters;
