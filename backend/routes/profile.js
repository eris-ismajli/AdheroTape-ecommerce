import express from "express";
import { getUserById } from "../data/auth-data.js";
import requireAuth from "../middleware/requireAuth.js";
import { updateName, updatePassword } from "../services/profile-service.js";
import { updateUserName, updateUserPassword } from "../data/profile-data.js";
const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    res.json({
      user,
    });
  } catch (err) {
    console.error("Failed to fetch profile data:", err);
    res.status(500).json({ message: "Failed to fetch current user" });
  }
});

router.patch("/update-name", requireAuth, async (req, res) => {
  try {
    const user = await updateName({
      userId: req.user.id,
      newName: req.body.name,
    });

    res.json({ user });
  } catch (err) {
    console.error("Failed to update user name", err);
    res.status(400).json({ message: err.message });
  }
});

router.patch("/update-password", requireAuth, async (req, res) => {
  try {
    const user = await updatePassword({
      userId: req.user.id,
      newPassword: req.body.newPassword,
      currentPassword: req.body.currentPassword,
    });

    res.json({ user });
  } catch (err) {
    console.error("Failed to update user password", err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
