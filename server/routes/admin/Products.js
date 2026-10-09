const expres = require('express')
const router = expres.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const ProductController = require('../../controllers/Admin/ProductController')
const upload = require('../../config/multer')


router.use(authenticateAdmin)

router.post('/products', upload.array('images', 5), ProductController.addProduct)


module.exports = router