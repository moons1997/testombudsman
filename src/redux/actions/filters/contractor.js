const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_contractor", payload: event });
  };
};
export default changeAllFilter;
