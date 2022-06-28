const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_inspectionresult", payload: event });
  };
};
export default changeAllFilter;
