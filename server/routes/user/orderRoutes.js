const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth')
const OrderController = require('../../controllers/users/orderController')

router.use(authenticate)


router.post("/order/stockvalidation", OrderController.StockValidation);


module.exports = router