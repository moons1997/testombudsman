const defaultState = {
  fullName: {},
  user: {},
  position: {},
  parentOrganizationId: {},
  isHR: {
    value: "true",
    matchMode: "equals",
  },
};

export const kadr = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_kadr":
      return action.payload;
    default:
      return state;
  }
};
