const express = require("express")
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const OrderController = require('../../controllers/users/orderController')

router.use(authenticateAdmin)

router.get('/orders',OrderController.getOrdersAdmin)



module.exports = router