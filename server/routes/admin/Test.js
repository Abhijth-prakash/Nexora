const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/Admin/ProductController')
const upload = require('../../config/multer')
const CategoryController = require('../../controllers/Admin/CategoryController')
const OrderController = require('../../controllers/users/orderController')


router.post('/products', upload.array('images', 5), ProductController.addProduct)
router.get('/products/:id',ProductController.GetProductbyid)
router.patch('/products/visible', ProductController.visibleToggle);
router.delete('/products/:id', ProductController.DeleteProduct);
router.patch('/products/:id',upload.array('images', 5),ProductController.UpdateProduct);
router.get('/products',ProductController.GetProducts)

router.get('/category/all',CategoryController.getallCategories)
router.post('/category', upload.single('image'), CategoryController.addCategory);
router.patch('/category/:id', upload.single('image'), CategoryController.editCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

router.post('/products/:id/variant',upload.array('images',5),ProductController.addVariant)
router.delete('/products/:id/:variantId',ProductController.deleteVariant)


//users




module.exports = router