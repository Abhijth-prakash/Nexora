const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth')
const OrderController = require('../../controllers/users/orderController')

router.use(authenticate)


router.post("/order/stockvalidation", OrderController.StockValidation);
router.get("/order/orderSummary", OrderController.orderSummary);
router.post("/order/GenerateOrder", OrderController.GenerateOrder);

//payment
router.post('/order/payment',OrderController.PaymentController)
router.post('/order/verifypayment',OrderController.verifyPayment)
router.post('/order/cod/sendOtp',OrderController.codVerify)


module.exports = router