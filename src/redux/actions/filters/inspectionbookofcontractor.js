const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_inspectionbookofcontractor", payload: event });
  };
};
export default changeAllFilter;
