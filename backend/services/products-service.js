import {
  getFilteredProductsQuery,
  getFilteredProductsCountQuery,
  getAllProductSizes,
  getAllProductImages,
  getSingleProductQuery,
  getProductSizesQuery,
  getProductImagesQuery,
} from "../data/products-data.js";

export const getAllProducts = async (filters, page, limit) => {
  const [products, total] = await Promise.all([
    getFilteredProductsQuery(filters, page, limit),
    getFilteredProductsCountQuery(filters),
  ]);

  const productIds = products.map((p) => p.id);

  const [sizes, images] = await Promise.all([
    getAllProductSizes(productIds),
    getAllProductImages(productIds),
  ]);

  const sizesMap = {};
  sizes.forEach((s) => {
    if (!sizesMap[s.product_id]) sizesMap[s.product_id] = [];
    sizesMap[s.product_id].push({ width: s.width, length: s.length });
  });

  const imagesMap = {};
  images.forEach((i) => {
    if (!imagesMap[i.product_id]) imagesMap[i.product_id] = [];
    imagesMap[i.product_id].push(i.image_url);
  });

  return {
    data: products.map((p) => ({
      ...p,
      sizes: sizesMap[p.id] || [],
      images: imagesMap[p.id] || [],
    })),
    total,
  };
};

/**
 * SINGLE PRODUCT
 */
export const getSingleProduct = async (id) => {
  const product = await getSingleProductQuery(id);
  if (!product) return null;

  const [sizes, images] = await Promise.all([
    getProductSizesQuery(id),
    getProductImagesQuery(id),
  ]);

  return {
    ...product,
    sizes,
    images: images.map((i) => i.image_url),
  };
};
