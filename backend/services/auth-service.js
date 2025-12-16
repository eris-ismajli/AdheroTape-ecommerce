import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser, getUserByEmail } from "../data/auth-data.js";
import {
  createEmailVerification,
  getValidVerification,
  deleteVerification,
} from "../data/email-verification-data.js";
import { sendVerificationEmail } from "../utils/emailVerification.js";
import { createAccessToken, createRefreshToken } from "../helpers/tokens.js";
import { getCart } from "./cart-service.js";
import { getWishlist } from "./wishlist-service.js";

import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";

export async function register({ name, email, password }, res) {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6)
    throw new Error("Password must be at least 6 characters");

  const existing = await getUserByEmail(email);
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await createUser({
    name,
    email,
    passwordHash,
    emailVerified: false,
  });

  // 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  await createEmailVerification({ userId, codeHash });
  await sendVerificationEmail(email, code);

  // Auto-login tokens
  const accessToken = createAccessToken({ id: userId });
  const refreshToken = createRefreshToken({ id: userId });

  if (res) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  // Fetch cart/wishlist
  const cartData = await getCart({ userId });
  const wishlistData = await getWishlist({ userId });

  return {
    user: { id: userId, name, email },
    cart: { items: cartData.items || cartData || [] },
    wishlist: { items: wishlistData.items || wishlistData || [] },
    accessToken,
    refreshToken,
  };
}

export async function verifyEmail({ email, code }, res) {
  if (!email || !code) throw new Error("Email and code are required");

  const user = await getUserByEmail(email);
  if (!user) throw new Error("Invalid email or code");
  if (user.email_verified) throw new Error("Email already verified");

  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const valid = await getValidVerification({ userId: user.id, codeHash });
  if (!valid) throw new Error("Invalid or expired code");

  await db.query(`UPDATE users SET email_verified = true WHERE id = ?`, [
    user.id,
  ]);
  await deleteVerification(user.id);

  // Auto-login tokens
  const accessToken = createAccessToken({ id: user.id });
  const refreshToken = createRefreshToken({ id: user.id });

  if (res) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  const cartData = await getCart({ userId: user.id });
  const wishlistData = await getWishlist({ userId: user.id });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    cart: { items: cartData.items || cartData || [] },
    wishlist: { items: wishlistData.items || wishlistData || [] },
    accessToken,
    refreshToken,
  };
}

export async function login({ email, password }, res) {
  if (!email || !password) throw new Error("Email and password required");

  const user = await getUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  if (!user.email_verified) throw new Error("Please verify your email first");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = createAccessToken({ id: user.id });
  const refreshToken = createRefreshToken({ id: user.id });

  if (res) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  const cartData = await getCart({ userId: user.id });
  const wishlistData = await getWishlist({ userId: user.id });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    cart: { items: cartData.items || cartData || [] },
    wishlist: { items: wishlistData.items || wishlistData || [] },
    accessToken,
    refreshToken,
  };
}
