import express from "express";
import {
  getAllProducts,
  getSingleProduct,
} from "../services/products-service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
      colors: req.query.colors ? req.query.colors.split(",") : [],
      widths: req.query.widths ? req.query.widths.split(",") : [],
      lengths: req.query.lengths ? req.query.lengths.split(",") : [],
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const page = Number(req.query.page) || 1;
    const limit = 12;

    const result = await getAllProducts(filters, page, limit);
    res.json(result);
  } catch (err) {
    console.error("GET /shop error:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getSingleProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("GET /shop/:id error:", err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

export default router;
