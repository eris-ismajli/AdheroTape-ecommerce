import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
  REPLACE_CART,
  INCREMENT_CART_ITEM,
} from "./constants";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case REPLACE_CART: {
      const normalized = action.payload.map((item) => ({
        ...item,
        cartItemId: item.cartItemId ?? item.id, // DB ID
        clientItemId: item.cartItemId ?? item.id, // 👈 reuse DB ID here
        productId: item.productId ?? item.product_id,
        chosenColor: item.chosenColor ?? item.chosen_color,
        chosenWidth: item.chosenWidth ?? item.chosen_width,
        chosenLength: item.chosenLength ?? item.chosen_length,
      }));

      // 🔥 THIS WAS MISSING
      saveCart(normalized);

      return { ...state, items: normalized };
    }

    // 👇 ALL BELOW IS GUEST-ONLY (unchanged)

    case ADD_TO_CART: {
      const { product, quantity, chosenColor, chosenWidth, chosenLength } =
        action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.id === product.id &&
          item.chosenColor === chosenColor &&
          item.chosenWidth === chosenWidth &&
          item.chosenLength === chosenLength
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            clientItemId: crypto.randomUUID(), // 👈 guest-only id
            productId: product.id, // 👈 ALWAYS THIS
            title: product.title,
            price_raw: product.price_raw,
            images: product.images,
            category: product.category,
            quantity,
            chosenColor,
            chosenWidth,
            chosenLength,
          },
        ];
      }

      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case REMOVE_ONE_FROM_CART: {
      const id = action.payload;

      const existing = state.items.find(
        (item) => item.cartItemId === id || item.id === id
      );

      if (!existing || existing.quantity === 1) return state;

      const updatedItems = state.items.map((item) =>
        item.cartItemId === id || item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case REMOVE_PRODUCT: {
      const id = action.payload;

      const updatedItems = state.items.filter(
        (item) => item.cartItemId !== id && item.clientItemId !== id
      );

      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case INCREMENT_CART_ITEM: {
      const id = action.payload;

      const updatedItems = state.items.map((item) =>
        item.clientItemId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
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
