const defaultState = {
  title: {},
  date: {},
};

export const news = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_news":
      return action.payload;
    default:
      return state;
  }
};
