import { ActionTree } from 'vuex';

import newOrderAudio from '@assets/new-order-audio.mp3';
import { IOrderStatus } from '@models/IOrder';
import { getOrders } from '@api/orders';

import { StateInterface } from '../index';
import { OrdersState } from './state';

const audioFile = new Audio(newOrderAudio);
audioFile.loop = true;
audioFile.volume = 1;

const actions: ActionTree<OrdersState, StateInterface> = {
  async loadOpenOrders(context) {
    void context.commit('setLoadingOpenOrders', true);

    const orders = await getOrders({
      status: [
        IOrderStatus.Pending,
        IOrderStatus.Production,
        IOrderStatus.Delivery,
      ],
    });

    void context.commit('setOpenOrders', orders);
    void context.commit('setLoadingOpenOrders', false);

    const hasPendingOrders = orders
      .find((order) => order.status === IOrderStatus.Pending) !== undefined;

    if (context.state.playAudioOnAllPages && hasPendingOrders) {
      void audioFile.play();
    } else {
      void audioFile.pause();
    }
  },
};

export default actions;
