import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function requireAuth(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = decoded; // { id }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
