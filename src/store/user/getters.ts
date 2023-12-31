import { GetterTree } from 'vuex';

import { StateInterface } from '../index';
import { UserState } from './state';

const getters: GetterTree<UserState, StateInterface> = {
  user(state: UserState) {
    return state.user;
  },
};

export default getters;
