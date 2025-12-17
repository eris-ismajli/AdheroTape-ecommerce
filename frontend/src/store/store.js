import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/reducer";
import wishlistReducer from "./wishlist/reducer";
import authReducer from "./auth/reducer";
import reviewsReducer from "./reviews/reducer";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    reviews: reviewsReducer,
  },
});
