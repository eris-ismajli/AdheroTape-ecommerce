import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
  REPLACE_CART,
  INCREMENT_CART_ITEM,
} from "./constants";

import axiosInstance from "../../utils/axiosInstance";

export const incrementCartItem = (cartItemId) => async (dispatch, getState) => {
  const { auth } = getState();

  // 🟡 GUEST → local increment
  if (!auth?.isAuthenticated) {
    dispatch({
      type: INCREMENT_CART_ITEM,
      payload: cartItemId,
    });
    return;
  }

  // 🟢 AUTH → backend source of truth
  await axiosInstance.post("/user/cart/add-one", {
    cartItemId,
  });

  const { data } = await axiosInstance.get("/user/cart");
  dispatch({
    type: REPLACE_CART,
    payload: data.items,
  });
};

export const fetchCart = () => async (dispatch, getState) => {
  const { auth } = getState();

  // 🟡 GUEST → restore from localStorage
  if (!auth?.isAuthenticated) {
    const guestCart = JSON.parse(localStorage.getItem("cart")) || [];

    dispatch({
      type: REPLACE_CART,
      payload: guestCart,
    });

    return;
  }

  // 🟢 AUTHENTICATED → fetch from DB
  try {
    const { data } = await axiosInstance.get("/user/cart");

    dispatch({
      type: REPLACE_CART,
      payload: data.items,
    });
  } catch (err) {
    console.error("Failed to fetch cart", err);
  }
};

export const syncCartOnLogin = () => async (dispatch) => {
  const guestCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!guestCart.length) return;

  const payload = {
    items: guestCart
      .filter((item) => item.productId) // 👈 DROP BROKEN ITEMS
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        chosenColor: item.chosenColor ?? null,
        chosenWidth: item.chosenWidth ?? null,
        chosenLength: item.chosenLength ?? null,
      })),
  };

  const { data } = await axiosInstance.post("/user/cart/sync", payload);

  console.log("SYNCING CART ON LOGIN:", data)

  dispatch({
    type: REPLACE_CART,
    payload: data.items,
  });

  localStorage.removeItem("cart");
};

export const addToCart = (payload) => async (dispatch, getState) => {
  const { auth } = getState();

  // 🟢 GUEST — local reducer only
  if (!auth?.isAuthenticated) {
    dispatch({ type: ADD_TO_CART, payload });
    return;
  }

  // 🔵 AUTH — backend is source of truth
  const productId =
    payload.productId ?? // from Cart
    payload.product?.id; // from ProductDetails

  if (!productId) {
    console.error("❌ addToCart missing productId", payload);
    return;
  }

  await axiosInstance.post("/user/cart/add", {
    productId,
    quantity: payload.quantity,
    chosenColor: payload.chosenColor ?? null,
    chosenWidth: payload.chosenWidth ?? null,
    chosenLength: payload.chosenLength ?? null,
  });

  // 🔥 re-fetch clean cart from DB
  const { data } = await axiosInstance.get("/user/cart");
  dispatch({ type: REPLACE_CART, payload: data.items });
};

export const removeOneFromCart = (cartItemId) => async (dispatch, getState) => {
  const isAuthenticated = getState().auth.isAuthenticated;

  if (!isAuthenticated) {
    dispatch({ type: REMOVE_ONE_FROM_CART, payload: cartItemId });
    return;
  }

  const { data } = await axiosInstance.post("/user/cart/remove-one", {
    cartItemId,
  });

  dispatch({ type: REPLACE_CART, payload: data.items });
};

export const removeProduct = (cartItemId) => async (dispatch, getState) => {
  const isAuthenticated = getState().auth.isAuthenticated;

  if (!isAuthenticated) {
    dispatch({ type: REMOVE_PRODUCT, payload: cartItemId });
    return;
  }

  const { data } = await axiosInstance.delete(`/user/cart/item/${cartItemId}`);

  dispatch({ type: REPLACE_CART, payload: data.items });
};

export const clearCart = () => async (dispatch, getState) => {
  const isAuthenticated = getState().auth.isAuthenticated;

  if (!isAuthenticated) {
    dispatch({ type: CLEAR_CART });
    return;
  }

  await axiosInstance.delete("/user/cart/clear");
  dispatch({ type: REPLACE_CART, payload: [] });
};
