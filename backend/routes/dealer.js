import express from "express";
import DealerService from "../services/dealer-service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await DealerService.submit(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
