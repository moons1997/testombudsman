const defaultState = {
  requestDocNumber: {},
  dateOfCreated: {},
  commentedDate: {},
  commentedUser: {},
  startDate: {},
  docDate: {},
  contractor: {},
  contractorInn: {},
  conclusionId: {},
  comment: {},
  regionId: {},
  orderedOrganizationId: {},
  authorizedOrganizationId: {},
};

export const InspectionConclusion = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_AllInspectionConclusion":
      return action.payload;
    default:
      return state;
  }
};
