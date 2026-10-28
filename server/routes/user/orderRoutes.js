const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth')
const OrderController = require('../../controllers/users/orderController')

router.use(authenticate)


router.post("/order/stockvalidation", OrderController.StockValidation);
router.get("/order/orderSummary", OrderController.orderSummary);
router.post("/order/orderVerification", OrderController.orderVerification);


module.exports = router