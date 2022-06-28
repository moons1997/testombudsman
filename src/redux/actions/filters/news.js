const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_news", payload: event });
  };
};
export default changeAllFilter;
