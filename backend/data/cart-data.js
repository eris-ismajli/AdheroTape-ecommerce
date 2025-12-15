import db from "../config/db.js";

/**
 * Insert or increment a cart item (variant-aware)
 */
export const upsertCartItem = async ({
  userId,
  productId,
  quantity,
  chosenColor,
  chosenWidth,
  chosenLength,
}) => {
  const [rows] = await db.query(
    `
    SELECT id, quantity
    FROM user_cart_items
    WHERE user_id = ?
      AND product_id = ?
      AND IFNULL(chosen_color, '') = IFNULL(?, '')
      AND IFNULL(chosen_width, '') = IFNULL(?, '')
      AND IFNULL(chosen_length, '') = IFNULL(?, '')
    `,
    [userId, productId, chosenColor, chosenWidth, chosenLength]
  );

  if (rows.length > 0) {
    // ✅ identical specs → increment quantity
    await db.query(
      `
      UPDATE user_cart_items
      SET quantity = quantity + ?
      WHERE id = ?
      `,
      [quantity, rows[0].id]
    );
  } else {
    // ✅ same product, different specs → new row
    await db.query(
      `
      INSERT INTO user_cart_items
        (user_id, product_id, quantity, chosen_color, chosen_width, chosen_length)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userId, productId, quantity, chosenColor, chosenWidth, chosenLength]
    );
  }
};

export const decrementCartItem = async ({ cartItemId, userId }) => {
  await db.query(
    `
    UPDATE user_cart_items
    SET quantity = quantity - 1
    WHERE id = ? AND user_id = ? AND quantity > 1
    `,
    [cartItemId, userId]
  );
};

export const deleteCartItem = async ({ cartItemId, userId }) => {
  await db.query(
    `
    DELETE FROM user_cart_items
    WHERE id = ? AND user_id = ?
    `,
    [cartItemId, userId]
  );
};

export const clearCart = async ({ userId }) => {
  await db.query(`DELETE FROM user_cart_items WHERE user_id = ?`, [userId]);
};

/**
 * Get cart items with product + images
 */
export const getCartByUser = async ({ userId }) => {
  const [rows] = await db.query(
    `
    SELECT
      c.id AS cart_item_id,
      c.quantity,
      c.chosen_color,
      c.chosen_width,
      c.chosen_length,
      p.*
    FROM user_cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
    `,
    [userId]
  );

  if (!rows.length) return [];

  const productIds = rows.map((r) => r.id);

  const [images] = await db.query(
    `
    SELECT product_id, image_url
    FROM product_images
    WHERE product_id IN (?)
    `,
    [productIds]
  );

  const imagesByProduct = {};
  images.forEach((img) => {
    if (!imagesByProduct[img.product_id]) {
      imagesByProduct[img.product_id] = [];
    }
    imagesByProduct[img.product_id].push(img.image_url);
  });

  return rows.map((row) => ({
    cartItemId: row.cart_item_id,
    quantity: row.quantity,
    chosenColor: row.chosen_color,
    chosenWidth: row.chosen_width,
    chosenLength: row.chosen_length,

    // product fields
    id: row.id,
    title: row.title,
    category: row.category,
    price_raw: row.price_raw,
    url: row.url,
    images: imagesByProduct[row.id] || [],
  }));
};
