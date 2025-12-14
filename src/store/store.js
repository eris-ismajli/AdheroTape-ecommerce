import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/reducer";
import wishlistReducer from "./wishlist/reducer";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
