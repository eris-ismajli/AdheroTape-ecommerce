// checkout-service.js
import Stripe from "stripe";
import { createOrder, updatePaymentStatus } from "../data/checkout-data.js";
import { sendReceiptEmail } from "../utils/paymentReceipt.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
export async function createCheckoutSession(req, res) {
  try {
    const { items, shipping_address, user_id } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    function parsePrice(price) {
      if (!price) return 0;
      return parseFloat(price.toString().replace(/[^0-9.]/g, "")) || 0;
    }

    const totalAmount = items.reduce((sum, item) => {
      const price = parsePrice(item.price_raw);
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    const shippingCost = 5.0;
    const finalAmount = totalAmount + shippingCost;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: "usd",
      metadata: { user_id: user_id || "guest" },
    });

    const orderId = await createOrder({
      user_id,
      total: finalAmount,
      shipping_address,
      payment_intent_id: paymentIntent.id,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      total: finalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
}

// Confirm order after successful payment
export async function confirmOrder(req, res) {
  try {
    const { orderId } = req.body;

    // Update order status
    await updatePaymentStatus(orderId, "paid");

    res.json({ message: "Order confirmed", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm order" });
  }
}

export async function sendReceipt(req, res) {
  const {
    email,
    customerName,
    orderId,
    items,
    shippingAddress,
    total,
    paymentMethod,
  } = req.body;

  try {
    await sendReceiptEmail({
      email,
      customerName,
      orderId,
      items,
      shippingAddress,
      total,
      paymentMethod,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending receipt:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
