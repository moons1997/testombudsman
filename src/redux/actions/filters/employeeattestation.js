const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_employeeattestation", payload: event });
  };
};
export default changeAllFilter;
