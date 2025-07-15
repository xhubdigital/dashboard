import { ActionContext, ActionTree } from 'vuex';

import { setToken, setRestaurantId } from '@boot/axios';
import {
  getUserData,
  signIn,
  signUp,
  refreshToken,
  IRegisterData,
  ISignInResponse,
} from '@api/auth';
import {
  localStorageHelper,
  REFRESH_TOKEN_KEY,
  USER_TOKEN_KEY,
} from '@helpers/localStorage';

import { StateInterface } from '../index';
import { UserState } from './state';

export interface IAuthData {
  email: string;
  password: string;
}

let loginInterval: NodeJS.Timeout | null;
let ordersInterval: NodeJS.Timeout | null;

function startOrdersAutoUpdate(
  context: ActionContext<UserState, StateInterface>,
) {
  if (ordersInterval) {
    return;
  }

  void context.dispatch('orders/loadOpenOrders', null, { root: true });

  ordersInterval = setInterval(() => {
    void context.dispatch('orders/loadOpenOrders', null, { root: true });
  }, 10000);
}

function stopOrdersAutoUpdate() {
  if (ordersInterval) {
    clearInterval(ordersInterval);
    ordersInterval = null;
  }
}

const actions: ActionTree<UserState, StateInterface> = {
  async login(context, authData: IAuthData) {
    const loginResponse = await signIn(authData.email, authData.password);

    await context.dispatch('processLogin', loginResponse);
  },

  async register(context, registerData: IRegisterData) {
    const loginResponse = await signUp(registerData);

    await context.dispatch('processLogin', loginResponse);
  },

  async refreshToken(context) {
    try {
      if (!context.state.refreshToken) {
        throw new Error('INVALID_REFRESH_TOKEN');
      }

      const loginResponse = await refreshToken(context.state.refreshToken);

      await context.dispatch('processLogin', loginResponse);
    } catch {
      void context.dispatch('logout');
    }
  },

  logout(context) {
    if (loginInterval) {
      clearInterval(loginInterval);
      loginInterval = null;
    }

    localStorageHelper.remove(REFRESH_TOKEN_KEY);
    localStorageHelper.remove(USER_TOKEN_KEY);

    setToken(null);
    setRestaurantId(null);

    context.commit('setToken', null);
    context.commit('setRefreshToken', null);

    context.commit('setUser', null);

    stopOrdersAutoUpdate();
  },

  async autoSignIn(context) {
    const refreshToken = localStorageHelper.get<string>(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      context.commit('setRefreshToken', refreshToken);

      await context.dispatch('refreshToken');
    }
  },

  async processLogin(context, tokenData: ISignInResponse) {
    try {
      const { accessToken, refreshToken } = tokenData;

      localStorageHelper.set(USER_TOKEN_KEY, accessToken);
      localStorageHelper.set(REFRESH_TOKEN_KEY, refreshToken);

      setToken(accessToken);

      const user = await getUserData();

      setRestaurantId(user.restaurant.id);

      if (!loginInterval) {
        loginInterval = setInterval(() => {
          void context.dispatch('refreshToken');
        }, 10 * 60000);
      }

      context.commit('setToken', accessToken);
      context.commit('setRefreshToken', refreshToken);
      context.commit('setUser', user);

      startOrdersAutoUpdate(context);
    } catch {
      await context.dispatch('logout');
    }
  },
};

export default actions;
