const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_complaint", payload: event });
  };
};
export default changeAllFilter;
