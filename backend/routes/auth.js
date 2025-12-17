import express from "express";
import jwt from "jsonwebtoken";
import { login, register, verifyEmail } from "../services/auth-service.js";
import { createAccessToken } from "../helpers/tokens.js";
import { getUserById } from "../data/auth-data.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await register(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await verifyEmail(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, accessToken, refreshToken, cart, wishlist } = await login(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ user, cart, wishlist });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = createAccessToken({ id: decoded.id });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch {
    res.sendStatus(403);
  }
});

// /auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    console.log(user)

    const { getCart } = await import("../services/cart-service.js");
    const { getWishlist } = await import("../services/wishlist-service.js");

    const cart = await getCart({ userId: user.id }); // returns array
    const wishlist = await getWishlist({ userId: user.id }); // returns array


    res.json({
      user,
      cart,
      wishlist,
    });
  } catch (err) {
    console.error("Failed to fetch current user data:", err);
    res.status(500).json({ message: "Failed to fetch current user" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
