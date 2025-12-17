// checkout-route.js
import express from "express";
import {
  confirmOrder,
  createCheckoutSession,
  sendReceipt,
} from "../services/checkout-service.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-order", confirmOrder);
router.post("/send-receipt", sendReceipt);

export default router;
