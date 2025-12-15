import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  syncWishlist,
  getWishlist,
  removeOne,
  toggleWishlist,
} from "../services/wishlist-service.js";

const router = express.Router();

/**
 * GET /user/wishlist
 * Returns authoritative wishlist (products)
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await getWishlist({ userId });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /user/wishlist/sync
 * Body can be:
 * { productIds: [8, 20, 4] } OR { items: [8, 20, 4] } OR { items: [{id:8}, ...] }
 */
router.post("/sync", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await syncWishlist({ userId, body: req.body });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /user/wishlist/:productId
 * Remove single product from wishlist
 */
router.delete("/:productId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const items = await removeOne({ userId, productId });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/toggle", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const items = await toggleWishlist({ userId, productId });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;
