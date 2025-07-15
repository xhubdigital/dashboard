import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import { path } from 'ramda';

import { StateInterface } from '@store/index';

import packageJson from '../../package.json';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function() {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      savedPosition: any,
    ) => {
      if (to.meta.isDialog || from.meta.isDialog) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return savedPosition;
      }

      return { left: 0, top: 0 };
    },

    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });

  Router.beforeEach((to, from, next) => {
    const title = path<string>(['meta', 'title'], to);

    const { productName } = packageJson;

    document.title = title ? `${title} - ${productName}` : productName;

    next();
  });

  return Router;
});
