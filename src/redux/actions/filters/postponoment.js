const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_AllPostponoment", payload: event });
  };
};
export default changeAllFilter;

export const statusIds = (event) => {
  return (dispatch) => {
    dispatch({ type: "CLEAN_PoststatusIds", payload: event });
  };
};
