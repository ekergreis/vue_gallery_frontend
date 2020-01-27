import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  // [OAUTH] Règle de contrôle sur route Vue.js (requiresAuth : true => accès OAut autroisé)
  Router.beforeEach((to, from, next) => {
    let reRoute = null;

    if (to.matched.some(record => record.meta.requiresAuth)) {
      // [OAUTH] Cette route nécessite une authentification
      // [OAUTH] Si elle n'est pas vérifié, redirection vers la route "login"
      if (!store.getters['auth/existAccessToken']) {
        reRoute = '/login';
      } else if (to.matched.some(record => record.meta.requiresAdmin)) {
        // [ROLE] Verification si "admin" pour route Vue.js
        if (!store.getters['auth/roleAuth']) {
          // [ROLE] Ce n'est pas un admin redirection vers accueil
          reRoute = '/';
        }
      }
    }

    if (reRoute) {
      next({
        path: reRoute,
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  });

  return Router;
}
