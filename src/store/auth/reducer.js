import { LOGIN_SUCCESS, LOGOUT } from "./constants";

const storedUser = localStorage.getItem("user");

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  user:
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { token, user } = action.payload;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        ...state,
        token,
        user,
        isAuthenticated: true,
      };
    }

    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
