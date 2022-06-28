const defaultState = {
  contractorInn: {},
  contractor: {},
  docNumber: {},
  docDate: {},
  orderedOrganizationId: {},
  inspectionOrganizationId: {},
  authorizedOrganizationId: {},
  regionId: {},
  checkTypeId: {},
  statusId: {},
  ceoStatusId: {},
  moderatorStatusId: {},
  inspectorStatusId: {},
};

export const inspectionbookofcontractor = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_inspectionbookofcontractor":
      return action.payload;
    default:
      return state;
  }
};
