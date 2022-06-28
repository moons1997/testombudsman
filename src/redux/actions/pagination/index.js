export const changeSortBy = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_SORTBY", payload: event });
  };
};
export const changeOrderType = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_ORDERTYPE", payload: event });
  };
};
export const changePage = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_PAGE", payload: event });
  };
};
export const changePageSize = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_PAGESIZE", payload: event });
  };
};
export const changeAll = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_All", payload: event });
  };
};
