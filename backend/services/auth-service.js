import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../data/auth-data.js";

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
  const userId = await createUser({ name, email, passwordHash });

  return createToken({ id: userId, email });
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return createToken({ id: user.id, email: user.email });
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
