import db from "../config/db.js";

/**
 * Get all reviews for a single product.
 * Includes reviewer name.
 */
export const getReviewsByProductIdQuery = async (productId) => {
  const [rows] = await db.query(
    `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    `,
    [productId]
  );

  return rows;
};

/**
 * Insert or update a user's review for a product.
 * Stars are REQUIRED. Comment is optional.
 * Uses unique_user_product constraint.
 */
export const upsertReviewQuery = async ({
  userId,
  productId,
  rating,
  comment,
}) => {
  const safeComment =
    typeof comment === "string" && comment.trim().length > 0
      ? comment.trim()
      : null;

  await db.query(
    `
    INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      rating = VALUES(rating),
      comment = VALUES(comment),
      created_at = CURRENT_TIMESTAMP
    `,
    [userId, productId, rating, safeComment]
  );

  return true;
};

/**
 * Recompute cached product rating stats (avg + count).
 * Call this after upsert/delete.
 */
export const refreshProductRatingStatsQuery = async (productId) => {
  // compute stats from reviews
  const [statsRows] = await db.query(
    `
    SELECT 
      ROUND(AVG(rating), 2) AS avg_rating,
      COUNT(*) AS rating_count
    FROM reviews
    WHERE product_id = ?
    `,
    [productId]
  );

  const avg = Number(statsRows?.[0]?.avg_rating ?? 0);
  const count = Number(statsRows?.[0]?.rating_count ?? 0);

  await db.query(
    `
    UPDATE products
    SET rating_avg = ?, rating_count = ?
    WHERE id = ?
    `,
    [avg, count, productId]
  );

  return { avg, count };
};

/**
 * Optional: delete a user's review (if you want later).
 */
export const deleteReviewByUserAndProductQuery = async (userId, productId) => {
  const [result] = await db.query(
    `DELETE FROM reviews WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );
  return result.affectedRows > 0;
};
