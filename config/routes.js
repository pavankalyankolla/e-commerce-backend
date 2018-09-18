const express = require('express');
const router = express.Router();

const { categoriesController } = require('../app/controllers/categories_controller');
const { productsController } = require('../app/controllers/products_controller');

router.use('/categories',categoriesController);
router.use('/products',productsController);
 
module.exports = {
    router
}