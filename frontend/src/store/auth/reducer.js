import { LOGIN_SUCCESS, LOGOUT, UPDATE_USER } from "./constants";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };

    case LOGOUT:
      return {
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
