const defaultState = {
  docNumber: {},
  contractorInn: {},
  contractor: {},
  docDate: {
    // value: localStorage.getItem("docDate"),
    // matchMode: "equals",
  },
  parentOrganizationId: {},
  organizationId: {},
  id: {},
  statusId: {},
};

export const attestation = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_attestation":
      return action.payload;
    default:
      return state;
  }
};
