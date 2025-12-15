import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/reducer";
import wishlistReducer from "./wishlist/reducer";
import authReducer from "./auth/reducer";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer
  },
});
