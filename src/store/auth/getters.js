// [OAUTH] Création getter pour identifier présence token ou vérifier group
export function existAccessToken(state) {
  if (state.access_token !== '') return true;
  return false;
}
export function roleAuth(state) {
  if (state.role === 'admin') return true;
  return false;
}
export function getAuthHeader(state) {
  return `${state.oauth_type} ${state.access_token}`; // [OAUTH] Exemple : Bearer xk8dfwv8783dxddjk232xjshoqpx
}
