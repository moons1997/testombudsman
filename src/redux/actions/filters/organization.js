const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_organization", payload: event });
  };
};
export default changeAllFilter;
