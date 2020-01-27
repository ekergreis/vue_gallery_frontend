// [OAUTH] Initialisation vuex variable "access_token"

export default {
  store_app: 'gallery',
  access_token: '',
  role: '',

  oauth: {
    grant_type: 'password',
    client_id: null,
    client_secret: null,
    scope: '*',
  },
  oauth_type: 'Bearer',
};
