import db from "../config/db.js";

export const getAllProductsQuery = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

export const getProductSizesQuery = (productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT width, length FROM product_sizes WHERE product_id = ?",
      [productId],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

export const getProductImagesQuery = (productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT image_url FROM product_images WHERE product_id = ?",
      [productId],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};
