import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
} from "./constants";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

// Save cart to localStorage anytime it changes
const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

// localStorage.removeItem("cart")

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      let updatedItems;

      if (existing) {
        updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...product, quantity }];
      }

      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case REMOVE_ONE_FROM_CART: {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (!existing) return state;

      let updatedItems;

      if (existing.quantity === 1) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        updatedItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case REMOVE_PRODUCT: {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case CLEAR_CART:
      saveCart([]);
      return { ...state, items: [] };

    default:
      return state;
  }
}
