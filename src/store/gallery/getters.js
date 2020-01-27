export const getRoute = state => search => `${state.URL_API}${state.API_ROUTES[search]}`;

export function getImgSelect(state) {
  return state.img_select;
}
export function getStorage(state) {
  return state.URL_IMG;
}
export function getGroups(state) {
  return state.groups;
}
