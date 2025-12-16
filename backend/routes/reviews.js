import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  getProductReviews,
  upsertProductReview,
  deleteMyProductReview,
} from "../services/reviews-service.js";

const router = express.Router();

/**
 * GET /reviews/product/:productId
 * Public — fetch reviews
 */
router.get("/product/:productId", async (req, res) => {
  try {
    const result = await getProductReviews(req.params.productId);
    res.json(result); // { data: reviews[] }
  } catch (err) {
    console.error("GET reviews error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to load reviews" });
  }
});

/**
 * POST /reviews
 * Protected — create OR update review (UPSERT)
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const result = await upsertProductReview({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });

    // result = { success: true, stats: { avg, count } }
    res.status(201).json(result);
  } catch (err) {
    console.error("POST review error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to submit review" });
  }
});

/**
 * DELETE /reviews/:productId
 * Protected — delete my review
 */
router.delete("/:productId", requireAuth, async (req, res) => {
  try {
    const result = await deleteMyProductReview({
      userId: req.user.id,
      productId: req.params.productId,
    });

    res.json(result); // { success, deleted, stats }
  } catch (err) {
    console.error("DELETE review error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to delete review" });
  }
});

/**
 * PATCH /reviews/:productId
 * Edit your review
 */
router.patch("/:productId", requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const stats = await upsertProductReview({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });

    res.json({ success: true, stats });
  } catch (err) {
    console.error("PATCH review error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to edit review" });
  }
});

export default router;
