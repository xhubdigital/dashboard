import { MutationTree } from 'vuex';
import { Moment } from 'moment';

import { ApplicationState } from './state';

const mutation: MutationTree<ApplicationState> = {
  setNow(state, now: Moment) {
    state.now = now;
  },
};

export default mutation;
