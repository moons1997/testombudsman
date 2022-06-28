const changeAllFilter = (event) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_attestation", payload: event });
  };
};
export default changeAllFilter;
