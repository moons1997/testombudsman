const paginationReducer = (
  state = {
    sortBy: "",
    orderType: "asc",
    page: 1,
    pageSize: 20,
  },
  action
) => {
  switch (action.type) {
    case "CHANGE_SORTBY":
      return { ...state, sortBy: action.payload };
    case "CHANGE_ORDERTYPE":
      return { ...state, orderType: action.payload };
    case "CHANGE_PAGE":
      return { ...state, page: action.payload };
    case "CHANGE_PAGESIZE":
      return { ...state, pageSize: action.payload };
    case "CHANGE_All":
      return action.payload;
    default:
      return state;
  }
};
export default paginationReducer;
