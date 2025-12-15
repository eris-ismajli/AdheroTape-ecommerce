import { LOGIN_SUCCESS, LOGOUT } from "./constants";
import axiosInstance from "../../utils/axiosInstance";

import { syncWishlistOnLogin } from "../wishlist/actions";
import { syncCartOnLogin } from "../cart/actions";

export const loginUser = (credentials) => async (dispatch) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);

  dispatch({
    type: LOGIN_SUCCESS,
    payload: data.token,
  });

  await dispatch(syncWishlistOnLogin());
  await dispatch(syncCartOnLogin());

  return data;
};

export const registerUser = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", payload);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => ({
  type: LOGOUT,
});
