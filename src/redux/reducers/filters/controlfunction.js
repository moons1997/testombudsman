const defaultState = {
  name: {},
  form: {},
  parentOrganizationId: {},
  normativeLegalDoc: {},
};

export const controlfunction = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_controlfunction":
      return action.payload;
    default:
      return state;
  }
};
