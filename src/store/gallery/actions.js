export function getRoute(context, { search }) {
  return new Promise((resolve) => {
    const url = `${context.state.URL_API}${context.state.API_ROUTES[search]}`;
    resolve(url);
  });
}
export function getCredentials(context, { credentials }) {
  return new Promise((resolve) => {
    credentials.client_id = context.state.API_SECRET.id;
    credentials.client_secret = context.state.API_SECRET.key;
    resolve(credentials);
  });
}
