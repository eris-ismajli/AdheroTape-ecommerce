import express from "express";
import { login, register } from "../services/auth-service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const token = await register(req.body);
    res.status(201).json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await login(req.body);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
