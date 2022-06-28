const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_AllInspectionConclusion", payload: event });
  };
};
export default changeAllFilter;
