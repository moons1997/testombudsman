const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_controlfunction", payload: event });
  };
};
export default changeAllFilter;
