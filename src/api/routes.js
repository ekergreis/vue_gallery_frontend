// [OAUTH] Configuration des routes vers API

import {
  BASE_TOKEN,
  API_URL,
  BASE_IMG_URL,
} from '../config/auth';


export default {
  // TOKEN_URL: `${BASE_TOKEN}oauth/token`,
  IMG_URL: BASE_IMG_URL,
  TOKEN_URL: `${BASE_TOKEN}login`,
  endpoints: {
    MENU_URL: `${API_URL}galeries`,
    GROUPS_INFOS_URL: `${API_URL}groups`,
    GALERIE_URL: `${API_URL}images`,
    COMMENTS_URL: `${API_URL}comments`,
    LOGOUT_URL: `${API_URL}logout`,
    // ressource_url : API_URL + "ressource"
  },
};
