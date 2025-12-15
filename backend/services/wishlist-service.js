import {
  addManyToWishlist,
  addToWishlist,
  getWishlistProductsByUser,
  removeFromWishlist,
  wishlistExists,
} from "../data/wishlist-data.js";

const normalizeProductIds = (items) => {
  // Accept either:
  // { productIds: [8,20,4] }
  // OR { items: [8,20,4] }
  // OR { items: [{id:8}, {id:20}] }  (if you accidentally send full product objects)
  const arr = Array.isArray(items) ? items : [];

  return arr
    .map((x) => (typeof x === "object" && x !== null ? x.id : x))
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x) && x > 0);
};

export const syncWishlist = async ({ userId, body }) => {
  const productIds =
    normalizeProductIds(body?.productIds) || normalizeProductIds(body?.items);

  // Merge (ignore duplicates)
  if (productIds.length) {
    await addManyToWishlist({ userId, productIds });
  }

  // Return authoritative wishlist (products)
  const products = await getWishlistProductsByUser({ userId });
  return products;
};

export const getWishlist = async ({ userId }) => {
  return await getWishlistProductsByUser({ userId });
};

export const toggleWishlist = async ({ userId, productId }) => {
  const exists = await wishlistExists({ userId, productId });

  if (exists) {
    await removeFromWishlist({ userId, productId });
  } else {
    await addToWishlist({ userId, productId });
  }

  // Always return authoritative wishlist
  return await getWishlistProductsByUser({ userId });
};

export const removeOne = async ({ userId, productId }) => {
  await removeFromWishlist({ userId, productId });
  return await getWishlistProductsByUser({ userId });
};
