import bcrypt from "bcrypt";
import { getUserById } from "../data/auth-data.js";
import { updateUserName, updateUserPassword } from "../data/profile-data.js";

export async function updateName({ userId, newName }) {
  if (!userId || !newName) {
    throw new Error("User ID and name are required");
  }

  const trimmedName = newName.trim();
  if (trimmedName.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  const existingUser = await getUserById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const updatedUser = await updateUserName({ userId, newName });
  return updatedUser;
}

export async function updatePassword({ userId, currentPassword, newPassword }) {
  if (!userId || !newPassword || !currentPassword) {
    throw new Error("User ID and passwords are required");
  }

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  if (!user.password_hash) {
    throw new Error("User has no password set");
  }

  const validPass = await bcrypt.compare(currentPassword, user.password_hash);
  if (!validPass) throw new Error("Wrong current password");

  const updatedUser = await updateUserPassword({ userId, newPassword });
  return updatedUser;
}
