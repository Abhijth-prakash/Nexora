const express = require("express");
const router = express.Router();
const {authenticate} = require('../../middilewares/auth');
const ProductsController = require("../../controllers/users/productsController");

router.get('/products',ProductsController.getProducts)

module.exports = router