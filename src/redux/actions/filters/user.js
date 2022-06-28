const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_user", payload: event });
  };
};
export default changeAllFilter;
