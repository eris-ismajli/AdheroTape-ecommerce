import { LOGIN_SUCCESS, LOGOUT, UPDATE_USER } from "./constants";
import axiosInstance from "../../utils/axiosInstance";
import { REPLACE_CART } from "../cart/constants";
import { REPLACE_WISHLIST } from "../wishlist/constants";
import { syncWishlistOnLogin } from "../wishlist/actions";
import { syncCartOnLogin } from "../cart/actions";

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials);

    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user } });
    if (Array.isArray(data.cart))
      dispatch({ type: REPLACE_CART, payload: data.cart });
    if (Array.isArray(data.wishlist))
      dispatch({ type: REPLACE_WISHLIST, payload: data.wishlist });

    const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    await dispatch(syncCartOnLogin(guestCart));
    await dispatch(syncWishlistOnLogin(guestWishlist));

    return data;
  } catch (err) {
    // Throw backend error message
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const updateUserPass =
  (newPassword, currentPassword) => async (dispatch) => {
    try {
      const { data } = await axiosInstance.patch("/profile/update-password", {
        newPassword,
        currentPassword,
      });

      dispatch({
        type: UPDATE_USER,
        payload: { user: data.user },
      });

      return data;
    } catch (err) {
      // Throw the backend error message
      throw new Error(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    "CURRENT USER", data;

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

const getGuestState = () => ({
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
});

export const registerUser = (payload) => async (dispatch) => {
  const { data } = await axiosInstance.post("/auth/register", payload);

  if (data.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: data.user },
    });

    const { cart, wishlist } = getGuestState();

    if (cart.length) {
      await dispatch(syncCartOnLogin(cart));
    }

    if (wishlist.length) {
      await dispatch(syncWishlistOnLogin(wishlist));
    }
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

export const updateUserName = (newName) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.patch("/profile/update-name", {
      name: newName,
    });

    dispatch({
      type: UPDATE_USER,
      payload: { user: data.user },
    });
  } catch (err) {
    console.error(
      "Error updating name",
      err.response?.data?.message || err.message
    );
  }
};
