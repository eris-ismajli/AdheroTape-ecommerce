import {
  getReviewsByProductIdQuery,
  upsertReviewQuery,
  refreshProductRatingStatsQuery,
  deleteReviewByUserAndProductQuery,
} from "../data/reviews-data.js";

export const getProductReviews = async (productId) => {
  const id = Number(productId);
  if (!Number.isFinite(id) || id <= 0) {
    const err = new Error("Invalid product id");
    err.status = 400;
    throw err;
  }

  const reviews = await getReviewsByProductIdQuery(id);

  return {
    data: reviews,
  };
};

export const upsertProductReview = async ({
  userId,
  productId,
  rating,
  comment,
}) => {
  const pid = Number(productId);
  const uid = Number(userId);
  const r = Number(rating);

  if (!Number.isFinite(uid) || uid <= 0) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  if (!Number.isFinite(pid) || pid <= 0) {
    const err = new Error("Invalid product id");
    err.status = 400;
    throw err;
  }

  if (!Number.isFinite(r) || r < 1 || r > 5) {
    const err = new Error("Rating must be between 1 and 5");
    err.status = 400;
    throw err;
  }

  // Comment is optional, but if provided must not be only whitespace
  const safeComment =
    typeof comment === "string" ? comment.trim().slice(0, 2000) : "";

  await upsertReviewQuery({
    userId: uid,
    productId: pid,
    rating: r,
    comment: safeComment,
  });

  const stats = await refreshProductRatingStatsQuery(pid);

  return {
    success: true,
    stats, // { avg, count } useful for frontend instant update
  };
};

export const deleteMyProductReview = async ({ userId, productId }) => {
  const pid = Number(productId);
  const uid = Number(userId);

  const deleted = await deleteReviewByUserAndProductQuery(uid, pid);
  const stats = await refreshProductRatingStatsQuery(pid);

  return { success: true, deleted, stats };
};
