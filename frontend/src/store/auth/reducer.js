import {
  AUTH_LOADING_FINISHED,
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_USER,
} from "./constants";

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAuthLoading: false,
      };
    case UPDATE_USER:
      return { ...state, user: action.payload.user };
    case LOGOUT:
      return { user: null, isAuthenticated: false, isAuthLoading: false };
    case AUTH_LOADING_FINISHED:
      return { ...state, isAuthLoading: false };
    default:
      return state;
  }
}
