const defaultState = {
  inn: {},
  orderCode: {},
  fullName: {},
  regionId: {},
  districtId: {},
  address: {},
  director: {},
  parentId: {},
};

export const organization = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_organization":
      return action.payload;
    default:
      return state;
  }
};
