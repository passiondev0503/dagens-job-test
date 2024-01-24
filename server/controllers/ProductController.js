const productModel = require("../models/productModel");
const apiResponse = require("../utils/apiResponse");

const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      apiResponse.sendResponse(
        res,
        400,
        null,
        "Name, Category, and Price are required to create a new product."
      );
      return;
    }

    const product = await productModel.addProduct(newProduct);
    apiResponse.sendResponse(res, 201, product, "Product successfully added.");
  } catch (err) {
    apiResponse.sendResponse(res, 500, null, err.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, maxPrice, minPrice, page = 1, pageSize = 24 } = req.query;
    const products = await productModel.getProducts(
      category,
      maxPrice,
      minPrice,
      page,
      pageSize
    );
    apiResponse.sendResponse(
      res,
      200,
      products,
      "Products retrieved successfully."
    );
  } catch (err) {
    apiResponse.sendResponse(res, 500, null, err.message);
  }
};

const getNearestProducts = async (req, res) => {
  try {
    const N = 5;
    const id = req.params.id;

    const products = await productModel.getNearestProducts(id, N);
    if (!products) {
      apiResponse.sendResponse(
        res,
        404,
        null,
        `Product with id: ${id} not found.`
      );
      return;
    }

    apiResponse.sendResponse(
      res,
      200,
      products,
      "Nearest products retrieved successfully."
    );
  } catch (err) {
    apiResponse.sendResponse(res, 500, null, err.message);
  }
};

module.exports = { createProduct, getProducts, getNearestProducts };
