const products = require("../db");
const fs = require("fs");
const addProduct = async (newProduct) => {
  const uuidv4 = require("uuid").v4;
  newProduct.id = uuidv4();
  products.push(newProduct);
  saveDb();
  return newProduct;
};

const getProducts = async (category, maxPrice, minPrice, page, pageSize) => {
  let filteredProducts = products.filter((product) => {
    if (category && !product.category.includes(category)) return false;
    if (maxPrice && product.price > maxPrice) return false;
    if (minPrice && product.price < minPrice) return false;
    return true;
  });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  return {
    data: filteredProducts.slice(start, end),
    total: filteredProducts.length,
  };
};

const getNearestProducts = async (id, N) => {
  const product = products.find((product) => product.id === id);
  if (!product) return { data: [], total: 0 };

  const sameCategoryProducts = products.filter(
    (p) => p.category === product.category && p.id !== id
  );
  const nearestProducts = sameCategoryProducts
    .sort(
      (a, b) =>
        Math.abs(product.price - a.price) - Math.abs(product.price - b.price)
    )
    .slice(0, N);

  return { data: nearestProducts, total: N };
};

const saveDb = async () => {
  fs.writeFileSync(
    "./db.js",
    `module.exports = ${JSON.stringify(products, null, 2)};`,
    "utf-8"
  );
};
module.exports = { addProduct, getProducts, getNearestProducts };
