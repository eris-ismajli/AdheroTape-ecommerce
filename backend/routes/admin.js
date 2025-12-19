import express from "express";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/dashboard", requireAdmin, (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

export default router;
