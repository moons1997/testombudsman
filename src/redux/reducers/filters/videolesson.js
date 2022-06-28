const defaultState = {
  tag: {},
  theme: {},
  category: {},
  number: {},
};

export const videolesson = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_videolesson":
      return action.payload;
    default:
      return state;
  }
};
