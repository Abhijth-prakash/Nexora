const express = require("express");
const router = express.Router();
const {authenticate} = require('../../middilewares/auth');
const ProductsController = require("../../controllers/users/productsController");



router.get('/products',ProductsController.getProducts)
router.get('/product',ProductsController.GetProductbyid)
router.get('/category',ProductsController.getCategories)
router.get('/category-tree', ProductsController.getCategoryTree)


router.get('/products/review', ProductsController.getReviews)
router.use(authenticate)
router.post('/products/review',ProductsController.createReview)
router.patch('/products/review/:reviewId', ProductsController.updateReview)

module.exports = router