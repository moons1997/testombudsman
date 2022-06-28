const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_kadr", payload: event });
  };
};
export default changeAllFilter;
