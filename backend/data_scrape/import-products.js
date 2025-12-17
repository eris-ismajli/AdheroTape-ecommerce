import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Create a separate promise pool for imports
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

(async () => {
  const raw = fs.readFileSync("brontapes_products.json", "utf8");
  const products = JSON.parse(raw);

  for (const p of products) {
    const [result] = await db.execute(
      `INSERT INTO products 
        (category, url, sku, title, price_raw, color, adhesive, carrier, total_thickness, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.category,
        p.url,
        p.sku,
        p.title,
        p.price_raw,
        p.color,
        p.adhesive,
        p.carrier,
        p.total_thickness,
        p.description,
      ]
    );

    const productId = result.insertId;

    // Sizes
    for (const w of p.sizes?.widths ?? []) {
      for (const l of p.sizes?.lengths ?? []) {
        await db.execute(
          `INSERT INTO product_sizes (product_id, width, length)
           VALUES (?, ?, ?)`,
          [productId, w, l]
        );
      }
    }

    // Images
    for (const img of p.images ?? []) {
      await db.execute(
        `INSERT INTO product_images (product_id, image_url)
         VALUES (?, ?)`,
        [productId, img]
      );
    }

  }

  process.exit();
})();
