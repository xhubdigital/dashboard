import { MutationTree } from 'vuex';

import { IUser } from '@models/IUser';
import { IRestaurant } from '@models/IRestaurant';

import { UserState } from './state';

const mutation: MutationTree<UserState> = {
  setToken(state: UserState, token: string) {
    state.accessToken = token;
  },

  setRefreshToken(state: UserState, refreshToken: string) {
    state.refreshToken = refreshToken;
  },

  setUser(state: UserState, user: IUser) {
    state.user = user;
  },

  updateRestaurant(state: UserState, restaurant: IRestaurant) {
    if (state.user) {
      state.user.restaurant = restaurant;
    }
  },
};

export default mutation;
