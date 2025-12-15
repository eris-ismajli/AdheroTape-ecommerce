import {
  upsertCartItem,
  decrementCartItem,
  deleteCartItem,
  clearCart,
  getCartByUser,
} from "../data/cart-data.js";
import db from "../config/db.js";

export const syncCart = async ({ userId, items }) => {
  for (const item of items) {
    if (!item.productId) continue; // 👈 safety net

    await upsertCartItem({
      userId,
      productId: item.productId,
      quantity: item.quantity,
      chosenColor: item.chosenColor,
      chosenWidth: item.chosenWidth,
      chosenLength: item.chosenLength,
    });
  }

  return await getCartByUser({ userId });
};

export const getCart = async ({ userId }) => {
  return await getCartByUser({ userId });
};

export const addToCart = async (userId, payload) => {
  if (!payload) {
    throw new Error("Cart payload missing");
  }

  const {
    productId,
    quantity,
    chosenColor = null,
    chosenWidth = null,
    chosenLength = null,
  } = payload;

  if (!productId) {
    throw new Error("Missing productId in cart payload");
  }

  if (!quantity || quantity < 1) {
    throw new Error("Invalid quantity");
  }

  await upsertCartItem({
    userId,
    productId,
    quantity,
    chosenColor,
    chosenWidth,
    chosenLength,
  });
};

export const removeOne = async ({ userId, cartItemId }) => {
  await decrementCartItem({ cartItemId, userId });
  return await getCartByUser({ userId });
};

export async function addOneToCart(userId, cartItemId) {
  // increment quantity
  await db.query(
    `
    UPDATE user_cart_items
    SET quantity = quantity + 1
    WHERE id = ? AND user_id = ?
    `,
    [cartItemId, userId]
  );

  // return updated cart
  const [rows] = await db.query(
    `
    SELECT *
    FROM user_cart_items
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows;
}

export const removeItem = async ({ userId, cartItemId }) => {
  await deleteCartItem({ cartItemId, userId });
  return await getCartByUser({ userId });
};

export const clearUserCart = async ({ userId }) => {
  await clearCart({ userId });
  return [];
};
