import Vue from 'vue';
import axios from 'axios';

Vue.prototype.$axios = axios;

// export default ({ app }) => {
export default ({ app, store }) => {
  // [OAUTH] Fonctions interceptions reqûete et réponse Axios
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // [OAUTH] Ajout requête intercepteur
  axios.interceptors.request.use(
    (config) => {
      // [OAUTH] Recherche oauth token à passer à la requête
      const authHeader = store.getters['auth/getAuthHeader'];
      if (authHeader) config.headers.Authorization = store.getters['auth/getAuthHeader'];
      return config;
    },
    error => Promise.reject(error),
  );

  // [OAUTH] Ajout réponse intercepteur
  axios.interceptors.response.use(
    response => (response),
    (error) => {
      // [OAUTH] Traitement du résultat de la requête si pb auth redirection
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Verif pour éviter boucle appels logout si retour 401 ou 403
        if (!error.config.url.includes(store.getters['gallery/getRoute']('LOGOUT'))) {
          store.dispatch('auth/logout');
        }
        app.router.replace('/login');
      }
      return Promise.reject(error);
    },
  );
};
