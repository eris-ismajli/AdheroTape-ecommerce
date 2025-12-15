import db from "../config/db.js";

/**
 * Insert productIds into wishlist for a user (ignores duplicates)
 */
export const addManyToWishlist = async ({ userId, productIds = [] }) => {
  if (!productIds.length) return;

  // Build: INSERT IGNORE INTO user_wishlist (user_id, product_id) VALUES (?, ?), (?, ?), ...
  const values = [];
  const placeholders = productIds
    .map((pid) => {
      values.push(userId, pid);
      return "(?, ?)";
    })
    .join(", ");

  const sql = `
    INSERT IGNORE INTO user_wishlist (user_id, product_id)
    VALUES ${placeholders}
  `;

  await db.query(sql, values);
};

/**
 * Fetch wishlist products (authoritative list)
 * Returns full product objects similar to what you currently store in localStorage.
 */
export const getWishlistProductsByUser = async ({ userId }) => {
  // 1️⃣ Get products
  const [products] = await db.query(
    `
    SELECT p.*
    FROM user_wishlist uw
    JOIN products p ON p.id = uw.product_id
    WHERE uw.user_id = ?
    ORDER BY uw.created_at DESC
    `,
    [userId]
  );

  if (!products.length) return [];

  // 2️⃣ Get images for these products
  const productIds = products.map((p) => p.id);

  const [images] = await db.query(
    `
    SELECT product_id, image_url
    FROM product_images
    WHERE product_id IN (?)
    `,
    [productIds]
  );

  // 3️⃣ Attach images array to each product
  const imagesByProduct = {};
  images.forEach((img) => {
    if (!imagesByProduct[img.product_id]) {
      imagesByProduct[img.product_id] = [];
    }
    imagesByProduct[img.product_id].push(img.image_url);
  });

  return products.map((product) => ({
    ...product,
    images: imagesByProduct[product.id] || [],
  }));
};

/**
 * Remove one product from wishlist
 */
export const removeFromWishlist = async ({ userId, productId }) => {
  await db.query(
    `DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );
};

export const wishlistExists = async ({ userId, productId }) => {
  const [rows] = await db.query(
    `SELECT 1 FROM user_wishlist WHERE user_id = ? AND product_id = ? LIMIT 1`,
    [userId, productId]
  );
  return rows.length > 0;
};

export const addToWishlist = async ({ userId, productId }) => {
  await db.query(
    `INSERT IGNORE INTO user_wishlist (user_id, product_id) VALUES (?, ?)`,
    [userId, productId]
  );
};
