const expres = require('express')
const router = expres.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const ProductController = require('../../controllers/Admin/ProductController')
const upload = require('../../config/multer')


router.use(authenticateAdmin)

router.get('/products',ProductController.GetProducts)
router.get('/products/:id',ProductController.GetProductbyid)
router.post('/products', upload.array('images', 5), ProductController.addProduct)
router.patch('/products/visible', ProductController.visibleToggle);
router.delete('/products/:id', ProductController.DeleteProduct);
router.patch('/products/:id',upload.array('images', 5),ProductController.UpdateProduct);


router.post('/products/:id/variant',upload.array('images',5),ProductController.addVariant)
router.delete('/products/:id/:variantId',ProductController.deleteVariant)

module.exports = router