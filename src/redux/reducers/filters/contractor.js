const defaultState = {
  innOrPinfl: {},
  orderCode: {},
  fullName: {},
  regionId: {},
  districtId: {},
  address: {},
  director: {},
  parentId: {},
};

export const contractor = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_contractor":
      return action.payload;
    default:
      return state;
  }
};
