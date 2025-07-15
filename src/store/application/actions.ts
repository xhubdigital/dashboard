import moment from 'moment';
import { ActionContext, ActionTree } from 'vuex';

import { StateInterface } from '../index';
import { ApplicationState } from './state';

let nowInterval: NodeJS.Timeout | null;

function startOrdersAutoUpdate(
  context: ActionContext<ApplicationState, StateInterface>,
) {
  if (nowInterval) {
    return;
  }

  nowInterval = setInterval(() => {
    void context.commit('setNow', moment());
  }, 1000);
}

const actions: ActionTree<ApplicationState, StateInterface> = {
  startStore(context) {
    startOrdersAutoUpdate(context);
  },
};

export default actions;
