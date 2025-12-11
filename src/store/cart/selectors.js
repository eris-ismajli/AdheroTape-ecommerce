export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
