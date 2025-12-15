import express from "express";
import { login, register, verifyEmail } from "../services/auth-service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result); // ✅ SEND FULL OBJECT
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const result = await verifyEmail(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
