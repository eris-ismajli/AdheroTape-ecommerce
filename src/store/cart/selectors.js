import { createSelector } from "@reduxjs/toolkit";

export const selectCartItems = (state) => state.cart?.items || [];

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + (item.quantity || 0), 0)
);
