const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/Admin/ProductController')
const upload = require('../../config/multer')

router.post('/products', upload.array('images', 5), ProductController.addProduct)
router.patch('/products/visible', ProductController.visibleToggle);


module.exports = router