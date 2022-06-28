const defaultState = {
  fullName: {},
  parentOrganizationId: {},
  organizationId: {},
  user: {},
  position: {},
  isHr: {
    value: "false",
    matchMode: "equals",
  },
};

export const employee = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_employee":
      return action.payload;
    default:
      return state;
  }
};
