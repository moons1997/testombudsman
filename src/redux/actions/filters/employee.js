const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_employee", payload: event });
  };
};
export default changeAllFilter;
