// Création mutation pour impacter img_select et group dispo
export const setImgSelect = (state, val) => {
  state.img_select = val;
};
export const setGroups = (state, val) => {
  state.groups = [];
  val.forEach((group) => {
    state.groups.push({
      value: group.id,
      label: group.name,
    });
  });
};
export const setNewGallery = (state, val) => {
  state.new_gallery = val;
};
