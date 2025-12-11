import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
} from "./constants";

// add product to cart
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

// remove one quantity
export const removeOneFromCart = (id) => ({
  type: REMOVE_ONE_FROM_CART,
  payload: id,
});

// remove whole product
export const removeProduct = (id) => ({
  type: REMOVE_PRODUCT,
  payload: id,
});

// clear entire cart
export const clearCart = () => ({
  type: CLEAR_CART,
});
