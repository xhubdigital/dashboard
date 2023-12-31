import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

declare module 'axios' {
  interface HeadersDefaults {
    Authorization: string | null;
    restaurant: string | null;
  }
}

type Headers = 'Authorization' | 'restaurant';

type RequestErrorCallback = (error: unknown) => void;

const requestErrorCallbacks: RequestErrorCallback[] = [];

const dispatchError = (error: unknown) => {
  requestErrorCallbacks.forEach((callback: RequestErrorCallback) => {
    callback(error);
  });
};

const onRequestError = (callback: RequestErrorCallback) => {
  requestErrorCallbacks.push(callback);
};

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/api' });

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  dispatchError(error);
  return Promise.reject(error);
});

function updateDefaultHeader(
  header: Headers,
  value: string | null,
) {
  if (value) {
    api.defaults.headers[header] = value;
  } else {
    delete api.defaults.headers[header];
  }
}

function setToken(token: string | null) {
  updateDefaultHeader('Authorization', token ? `Bearer ${token}` : null);
}

function setRestaurantId(id: string | null) {
  updateDefaultHeader('restaurant', id);
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, setToken, setRestaurantId, onRequestError };
