import express from "express";
import { getAllProducts, getSingleProduct } from "../services/products-service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getAllProducts();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error loading products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await getSingleProduct(req.params.id);
    if (!data) return res.status(404).json({ error: "Product not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
