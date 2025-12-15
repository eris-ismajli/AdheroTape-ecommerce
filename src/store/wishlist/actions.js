import axiosInstance from "../../utils/axiosInstance";
import { INCREMENT_CART_ITEM } from "../cart/constants";
import { REPLACE_WISHLIST } from "./constants";
import { TOGGLE_WISHLIST } from "./constants";

export const fetchWishlist = () => async (dispatch, getState) => {
  const { auth } = getState();

  // 🟡 GUEST → load from localStorage
  if (!auth?.isAuthenticated) {
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    dispatch({
      type: REPLACE_WISHLIST,
      payload: guestWishlist,
    });

    return;
  }

  // 🟢 AUTHENTICATED → load from DB
  try {
    const { data } = await axiosInstance.get("/user/wishlist");

    dispatch({
      type: REPLACE_WISHLIST,
      payload: data.items,
    });
  } catch (err) {
    console.error("Failed to fetch wishlist", err);
  }
};

export const toggleWishlist = (product) => async (dispatch, getState) => {
  const isAuthenticated = getState().auth.isAuthenticated;

  if (!isAuthenticated) {
    dispatch({
      type: TOGGLE_WISHLIST,
      payload: product,
    });
    return;
  }

  const { data } = await axiosInstance.post("/user/wishlist/toggle", {
    productId: product.id,
  });

  dispatch({
    type: REPLACE_WISHLIST,
    payload: data.items,
  });
};

export const syncWishlistOnLogin = () => async (dispatch) => {
  const guestWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!guestWishlist.length) return;

  const productIds = guestWishlist.map((item) => item.id);

  const { data } = await axiosInstance.post("/user/wishlist/sync", {
    productIds,
  });

  dispatch({
    type: REPLACE_WISHLIST,
    payload: data.items,
  });

  localStorage.removeItem("wishlist");
};
