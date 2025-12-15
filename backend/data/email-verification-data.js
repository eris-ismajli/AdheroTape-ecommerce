import db from "../config/db.js";

export async function createEmailVerification({ userId, codeHash }) {
  // remove old codes (important)
  await db.query(
    `DELETE FROM email_verifications WHERE user_id = ?`,
    [userId]
  );

  await db.query(
    `
    INSERT INTO email_verifications (user_id, code_hash, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
    `,
    [userId, codeHash]
  );
}

export async function getValidVerification({ userId, codeHash }) {
  const [rows] = await db.query(
    `
    SELECT id FROM email_verifications
    WHERE user_id = ?
      AND code_hash = ?
      AND expires_at > NOW()
    `,
    [userId, codeHash]
  );

  return rows[0];
}

export async function deleteVerification(userId) {
  await db.query(
    `DELETE FROM email_verifications WHERE user_id = ?`,
    [userId]
  );
}
