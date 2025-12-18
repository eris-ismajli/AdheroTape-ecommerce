import bcrypt from "bcrypt";
import db from "../config/db.js";

export async function updateUserName({ userId, newName }) {
  const trimmedName = newName.trim();

  const [updateResult] = await db.query(
    `
    UPDATE users
    SET name = ?, updated_at = NOW()
    WHERE id = ?
    `,
    [trimmedName, userId]
  );

  if (updateResult.affectedRows === 0) {
    throw new Error("User not found");
  }

  const [rows] = await db.query(
    `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
}

export async function updateUserPassword({ userId, newPassword }) {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const [updateResult] = await db.query(
    `
        UPDATE users
        SET password_hash = ?, updated_at = NOW()
        WHERE id = ?
    `,
    [passwordHash, userId]
  );

  if (updateResult.affectedRows === 0) {
    throw new Error("User not found");
  }

  const [rows] = await db.query(
    `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
}
