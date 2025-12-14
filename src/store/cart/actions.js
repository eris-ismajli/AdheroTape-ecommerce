import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
} from "./constants";

// add product to cart
export const addToCart = (
  product,
  quantity = 1,
  chosenColor = "",
  chosenWidth = "",
  chosenLength = ""
) => ({
  type: ADD_TO_CART,
  payload: { product, quantity, chosenColor, chosenWidth, chosenLength },
});

export const removeOneFromCart = (id) => ({
  type: REMOVE_ONE_FROM_CART,
  payload: id,
});

export const removeProduct = (id) => ({
  type: REMOVE_PRODUCT,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
