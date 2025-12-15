import db from "../config/db.js";

export const getFilteredProductsCountQuery = async (filters = {}) => {
  let sql = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM products p
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    WHERE 1=1
  `;
  const values = [];

  if (filters.category && filters.category !== "All Tapes") {
    sql += " AND p.category = ?";
    values.push(filters.category);
  }

  if (filters.search) {
    sql += " AND p.title LIKE ?";
    values.push(`%${filters.search}%`);
  }

  const [rows] = await db.query(sql, values);
  return rows[0].total;
};

export const getFilteredProductsQuery = async (
  filters = {},
  page = 1,
  limit = 12
) => {
  const offset = (page - 1) * limit;

  let sql = `
    SELECT DISTINCT p.*
    FROM products p
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    WHERE 1=1
  `;
  const values = [];

  if (filters.category && filters.category !== "All Tapes") {
    sql += " AND p.category = ?";
    values.push(filters.category);
  }

  if (filters.search) {
    sql += " AND p.title LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (Array.isArray(filters.colors) && filters.colors.length) {
    sql += ` AND (${filters.colors
      .map(() => "FIND_IN_SET(?, p.color)")
      .join(" OR ")})`;
    values.push(...filters.colors);
  }

  if (Array.isArray(filters.widths) && filters.widths.length) {
    sql += ` AND ps.width IN (${filters.widths.map(() => "?").join(",")})`;
    values.push(...filters.widths);
  }

  if (Array.isArray(filters.lengths) && filters.lengths.length) {
    sql += ` AND ps.length IN (${filters.lengths.map(() => "?").join(",")})`;
    values.push(...filters.lengths);
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(limit, offset);

  const [rows] = await db.query(sql, values);
  return rows;
};

export const getAllProductSizes = async (productIds = []) => {
  if (!productIds.length) return [];

  const [rows] = await db.query(
    `SELECT product_id, width, length FROM product_sizes WHERE product_id IN (?)`,
    [productIds]
  );
  return rows;
};

export const getAllProductImages = async (productIds = []) => {
  if (!productIds.length) return [];

  const [rows] = await db.query(
    `SELECT product_id, image_url FROM product_images WHERE product_id IN (?)`,
    [productIds]
  );
  return rows;
};

/**
 * SINGLE PRODUCT
 */
export const getSingleProductQuery = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

export const getProductSizesQuery = async (id) => {
  const [rows] = await db.query(
    "SELECT width, length FROM product_sizes WHERE product_id = ?",
    [id]
  );
  return rows;
};

export const getProductImagesQuery = async (id) => {
  const [rows] = await db.query(
    "SELECT image_url FROM product_images WHERE product_id = ?",
    [id]
  );
  return rows;
};
