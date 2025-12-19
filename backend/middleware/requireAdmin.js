import { getUserById } from "../data/auth-data.js";
import requireAuth from "../middleware/requireAuth.js";

export default function requireAdmin(req, res, next) {
  requireAuth(req, res, async () => {
    try {
      const user = await getUserById(req.user.id); // fetch full user
      if (user.role !== "admin") {
        console.log("😨", user.role);
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }
      req.user = user; // attach full user object
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
}
