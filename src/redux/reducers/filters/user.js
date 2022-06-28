const defaultState = {
  userName: {},
  fullName: {},
  parentOrganizationId: {},
  organizationId: {},
};

export const user = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_user":
      return action.payload;
    default:
      return state;
  }
};
