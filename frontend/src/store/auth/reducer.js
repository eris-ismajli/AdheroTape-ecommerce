import { LOGIN_SUCCESS, LOGOUT } from "./constants";

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

    case LOGOUT:
      return {
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
