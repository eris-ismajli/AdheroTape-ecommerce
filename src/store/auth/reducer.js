import { LOGIN_SUCCESS, LOGOUT } from "./constants";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
