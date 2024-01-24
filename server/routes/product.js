const express = require('express');
const ProductController = require('../controllers/ProductController');
const validation = require('../middlewares/validation');

const router = express.Router();

router.get('/get', ProductController.getProducts);
router.get('/nearest/:id', ProductController.getNearestProducts);
router.post(
  '/register',
  validation.validateProduct,
  ProductController.createProduct
);

module.exports = router;
