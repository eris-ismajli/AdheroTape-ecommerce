import db from "../config/db.js";

export async function createUser({ name, email, passwordHash }) {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)`,
    [name, email, passwordHash]
  );
  return result.insertId;
}

export async function getUserByEmail(email) {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
}

export async function getUserById(id) {
  const [rows] = await db.query(
    `SELECT id, name, email, password_hash FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}
