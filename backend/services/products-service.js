import {
  getAllProductsQuery,
  getProductSizesQuery,
  getProductImagesQuery,
} from "../data/products-data.js";

export const getAllProducts = async () => {
  const products = await getAllProductsQuery();

  for (const p of products) {
    const sizes = await getProductSizesQuery(p.id);
    const images = await getProductImagesQuery(p.id);

    p.sizes = sizes;
    p.images = images.map((i) => i.image_url);
  }

  return products;
};

export const getSingleProduct = async (id) => {
  const products = await getAllProductsQuery();
  const product = products.find((p) => p.id == id);
  if (!product) return null;

  product.sizes = await getProductSizesQuery(product.id);
  product.images = (await getProductImagesQuery(product.id)).map((i) => i.image_url);

  return product;
};
