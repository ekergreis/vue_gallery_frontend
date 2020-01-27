// [OAUTH] Création mutation pour impacter oauth token et group

export const setToken = (state, val) => {
  state.access_token = val;
};
export const setRole = (state, val) => {
  state.role = val;
};
