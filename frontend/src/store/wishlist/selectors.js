import { createSelector } from "@reduxjs/toolkit";

export const selectWishlistItems = (state) =>
  state.wishlist?.items || [];

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);
