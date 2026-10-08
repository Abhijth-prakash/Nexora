const expres = require('express')
const router = expres.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const ProductController = require('../../controllers/Admin/ProductController')


router.use(authenticateAdmin)

router.post('/products',ProductController.addProduct)


module.exports = router