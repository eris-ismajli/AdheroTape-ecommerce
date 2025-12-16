import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "30d";

export const createAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
