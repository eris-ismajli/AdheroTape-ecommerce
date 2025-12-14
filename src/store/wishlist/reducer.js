import { TOGGLE_WISHLIST } from "./constants";

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const saveWishlist = (items) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

export default function wishlistReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_WISHLIST: {
      const exists = state.items.some(
        (item) => Number(item.id) === Number(action.payload.id)
      );

      const updatedItems = exists
        ? state.items.filter(
            (item) => Number(item.id) !== Number(action.payload.id)
          )
        : [...state.items, action.payload];

      saveWishlist(updatedItems);

      return {
        ...state,
        items: updatedItems,
      };
    }

    default:
      return state;
  }
}
