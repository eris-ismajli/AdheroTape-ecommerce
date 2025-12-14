import { TOGGLE_WISHLIST } from "./constants";

export const toggleWishlist = (id) => ({
  type: TOGGLE_WISHLIST,
  payload: id,
});
