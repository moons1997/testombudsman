const defaultState = {
  dateOfCreated: {},
  requestDocNumber: {},
  docDate: {},
  contractorInn: {},
  contractor: {},
  suggestion: {},
  user: {},
};

export const complaint = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_complaint":
      return action.payload;
    default:
      return state;
  }
};
