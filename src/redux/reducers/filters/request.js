const defaultState = {
  filters: {
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
    createdUserId: {},
  },
  toDocDate: "",
  fromDocDate: "",
  statusIds: [],
};

export const request = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_AllFilters":
      return { ...state, filters: action.payload };
    case "CLEAN_statusIds":
      return { ...state, statusIds: action.payload };
    case "CLEAN_fromDocDate":
      return { ...state, fromDocDate: action.payload };
    case "CLEAN_toDocDate":
      return { ...state, toDocDate: action.payload };
    case "CLEAN_Request":
      return { ...state, defaultState };
    default:
      return state;
  }
};
