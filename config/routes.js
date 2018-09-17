const express = require('express');
const router = express.Router();

const { categoriesController } = require('../app/controllers/categories_controller');

router.use('/categories',categoriesController)
 
module.exports = {
    router
}