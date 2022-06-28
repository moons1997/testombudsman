const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_videolesson", payload: event });
  };
};
export default changeAllFilter;
