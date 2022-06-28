const defaultState = {
  fullName: {},
  parentOrganizationId: {},
  organizationId: {},
  certificateNumber: {},
  expirationDate: {},
  user: {},
};

export const employeeattestation = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_employeeattestation":
      return action.payload;
    default:
      return state;
  }
};
