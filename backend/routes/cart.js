import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  syncCart,
  getCart,
  addToCart,
  removeOne,
  removeItem,
  clearUserCart,
  addOneToCart,
} from "../services/cart-service.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await getCart({ userId: req.user.id });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/sync", requireAuth, async (req, res, next) => {
  try {
    const items = await syncCart({
      userId: req.user.id,
      items: req.body.items || [],
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/add", requireAuth, async (req, res) => {
  try {
    await addToCart(req.user.id, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

router.post("/add-one", requireAuth, async (req, res) => {
  try {
    const { cartItemId } = req.body;
    const userId = req.user.id;

    if (!cartItemId) {
      return res.status(400).json({ message: "cartItemId required" });
    }

    const items = await addOneToCart(userId, cartItemId);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to increment item" });
  }
});

router.post("/remove-one", requireAuth, async (req, res, next) => {
  try {
    const items = await removeOne({
      userId: req.user.id,
      cartItemId: req.body.cartItemId,
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.delete("/item/:cartItemId", requireAuth, async (req, res, next) => {
  try {
    const items = await removeItem({
      userId: req.user.id,
      cartItemId: Number(req.params.cartItemId),
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.delete("/clear", requireAuth, async (req, res, next) => {
  try {
    await clearUserCart({ userId: req.user.id });
    res.json({ items: [] });
  } catch (e) {
    next(e);
  }
});

export default router;
