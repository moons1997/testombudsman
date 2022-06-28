const defaultState = {
  requestDocNumber: {},
  endDate: {},
  startDate: {},
  docDate: {},
  contractor: {},
  contractorInn: {},
};

export const inspectionresult = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_inspectionresult":
      return action.payload;
    default:
      return state;
  }
};
