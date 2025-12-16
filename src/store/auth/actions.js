import { LOGIN_SUCCESS, LOGOUT } from "./constants";
import axiosInstance from "../../utils/axiosInstance";
import { REPLACE_CART } from "../cart/constants";
import { REPLACE_WISHLIST } from "../wishlist/constants";
import { syncWishlistOnLogin } from "../wishlist/actions";
import { syncCartOnLogin } from "../cart/actions";

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials);

    console.log("LOGIN RESPONSE", data);

    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user } });

    if (Array.isArray(data.cart)) {
      dispatch({ type: REPLACE_CART, payload: data.cart });
    }
    if (Array.isArray(data.wishlist)) {
      dispatch({ type: REPLACE_WISHLIST, payload: data.wishlist });
    }

    // 🔹 Only sync guest items after a fresh login
    await dispatch(syncWishlistOnLogin());
    await dispatch(syncCartOnLogin());

    return data;
  } catch (err) {
    console.error("Login error", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    console.log("CURRENT USER", data);

    if (data.user) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.user },
      });

      // ✅ Populate cart/wishlist directly from backend
      if (Array.isArray(data.cart)) {
        dispatch({ type: REPLACE_CART, payload: data.cart });
      }

      if (Array.isArray(data.wishlist)) {
        dispatch({ type: REPLACE_WISHLIST, payload: data.wishlist });
      }
    }
  } catch (err) {
    console.log("User not logged in");
  }
};

export const registerUser = (payload) => async (dispatch) => {
  const { data } = await axiosInstance.post("/auth/register", payload);

  if (data.user) {
    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user } });
    await dispatch(syncWishlistOnLogin());
    await dispatch(syncCartOnLogin());
  }

  return data;
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    console.error("Logout error", err);
  }

  dispatch({ type: LOGOUT });
};
