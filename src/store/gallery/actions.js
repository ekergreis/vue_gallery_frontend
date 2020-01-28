export function getCredentials(context, { credentials }) {
  return new Promise((resolve) => {
    credentials.client_id = context.state.API_SECRET.id;
    credentials.client_secret = context.state.API_SECRET.key;
    resolve(credentials);
  });
}
