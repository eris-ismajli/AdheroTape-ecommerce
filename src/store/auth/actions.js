import { LOGIN_SUCCESS, LOGOUT } from "./constants";
import axiosInstance from "../../utils/axiosInstance";

import { syncWishlistOnLogin } from "../wishlist/actions";
import { syncCartOnLogin } from "../cart/actions";

import { setAuthToken } from "../../utils/axiosInstance";

export const loginUser = (credentials) => async (dispatch) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);

  console.log("LOGIN RESPONSE", data);

  // 🔑 SET TOKEN FIRST
  setAuthToken(data.token);

  dispatch({
    type: LOGIN_SUCCESS,
    payload: {
      token: data.token,
      user: data.user,
    },
  });

  // ✅ NOW these requests are authorized
  await dispatch(syncWishlistOnLogin());
  await dispatch(syncCartOnLogin());

  return data;
};

export const registerUser = (payload) => async (dispatch) => {
  const { data } = await axiosInstance.post("/auth/register", payload);

  setAuthToken(data.token);

  dispatch({
    type: LOGIN_SUCCESS,
    payload: {
      token: data.token,
      user: data.user,
    },
  });

  return data;
};

export const logoutUser = () => (dispatch) => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
};
