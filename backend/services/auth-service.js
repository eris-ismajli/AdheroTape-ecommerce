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
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d";

export async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userId = await createUser({
    name,
    email,
    passwordHash,
    emailVerified: false,
  });

  // 🔐 generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  await createEmailVerification({ userId, codeHash });
  await sendVerificationEmail(email, code);

  return {
    success: true,
    message: "Verification code sent",
  };
}

export async function verifyEmail({ email, code }) {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or code");
  }

  if (user.email_verified) {
    throw new Error("Email already verified");
  }

  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  const valid = await getValidVerification({
    userId: user.id,
    codeHash,
  });

  if (!valid) {
    throw new Error("Invalid or expired code");
  }

  await db.query(`UPDATE users SET email_verified = true WHERE id = ?`, [
    user.id,
  ]);

  await deleteVerification(user.id);

  // ✅ AUTO LOGIN
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.email_verified) {
    throw new Error("Please verify your email first");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = createToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
