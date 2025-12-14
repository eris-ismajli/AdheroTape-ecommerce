import {
  ADD_TO_CART,
  REMOVE_ONE_FROM_CART,
  REMOVE_PRODUCT,
  CLEAR_CART,
} from "./constants";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

// localStorage.removeItem("cart")

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity, chosenColor, chosenWidth, chosenLength } =
        action.payload;

      function hasIdenticalSpecs(item) {
        return (
          item.chosenColor === chosenColor &&
          item.chosenWidth === chosenWidth &&
          item.chosenLength === chosenLength
        );
      }

      const existingItem = state.items.find((item) => item.id === product.id);

      let updatedItems;

      // If there is an existing item with the same id as the item we wanna add
      // and they have identical specifications then
      // simply increment the quantity of that product
      if (existingItem && hasIdenticalSpecs(existingItem)) {
        updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // if there is an existing item with the same id but with different specs
        // assign a unique id to the item were about to add

        // The current problem is assigning a random then the backend doesnt recognize
        if (existingItem) {
          const oldId = existingItem.id;
          console.log(oldId);
          updatedItems = [
            ...state.items,
            {
              ...product,
              id: crypto.randomUUID(),
              oldId,
              quantity,
              chosenColor,
              chosenWidth,
              chosenLength,
            },
          ];
        } else {
          updatedItems = [
            ...state.items,
            { ...product, quantity, chosenColor, chosenWidth, chosenLength },
          ];
        }
      }

      console.log(updatedItems);
      saveCart(updatedItems);
      return { ...state, items: updatedItems };
    }

    case REMOVE_ONE_FROM_CART: {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (!existing) return state;

      let updatedItems;

      if (existing.quantity === 1) return;

      updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );

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
