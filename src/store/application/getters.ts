import { GetterTree } from 'vuex';

import { StateInterface } from '../index';
import { ApplicationState } from './state';

const getters: GetterTree<ApplicationState, StateInterface> = {
  now(state) {
    return state.now;
  },
};

export default getters;
