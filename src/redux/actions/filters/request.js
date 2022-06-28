export const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_AllFilters", payload: event });
  };
};
export const cleanRequest = () => {
  return (dispatch) => {
    dispatch({ type: "CLEAN_Request" });
  };
};
export const statusIds = (event) => {
  return (dispatch) => {
    dispatch({ type: "CLEAN_statusIds", payload: event });
  };
};

export const FromDocDate = (event) => {
  return (dispatch) => {
    dispatch({ type: "CLEAN_fromDocDate", payload: event });
  };
};

export const ToDocDate = (event) => {
  return (dispatch) => {
    dispatch({ type: "CLEAN_toDocDate", payload: event });
  };
};
