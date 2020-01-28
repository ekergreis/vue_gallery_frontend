import Http from 'axios';

export async function login(context, { username, password }) {
  // [OAUTH] Les objets data et les paramètres configués sont compactés (merge)
  let credentials = {
    username,
    password,
  };
  Object.assign(credentials, context.state.oauth);
  await context.dispatch(`${context.state.store_app}/getCredentials`, { credentials }, { root: true }).then((response) => {
    credentials = response;
  });

  const url = context.rootGetters[`${context.state.store_app}/getRoute`]('LOGIN');
  try {
    const response = await Http.post(url, credentials);
    context.commit('setToken', response.data.access_token);
    context.commit('setRole', response.data.group);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function logout(context) {
  if (context.state.access_token !== '') {
    const url = context.rootGetters[`${context.state.store_app}/getRoute`]('LOGOUT');
    await Http.get(url);
  }
  context.commit('setToken', '');
  context.commit('setRole', '');
}
