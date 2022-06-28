const defaultState = {
  filters: {
    requestDocNumber: {},
    endDate: {},
    startDate: {},
    docDate: {},
    contractorInn: {},
    contractor: {},
    orderedOrganizationId: {},
    inspectionOrganizationId: {},
    authorizedOrganizationId: {},
  },
  statusIds: [],
};

export const postponoment = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_AllPostponoment":
      return { ...state, filters: action.payload };
    case "CLEAN_PoststatusIds":
      return { ...state, statusIds: action.payload };
    default:
      return state;
  }
};
