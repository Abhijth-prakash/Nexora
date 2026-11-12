const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth')
const OrderController = require('../../controllers/users/orderController')
const ReturnController = require('../../controllers/Admin/ReturnController')

router.use(authenticate)


router.post("/order/stockvalidation", OrderController.StockValidation);
router.get("/order/orderSummary", OrderController.orderSummary);
router.post("/order/orderSummary", OrderController.orderSummary);
router.post("/order/GenerateOrder", OrderController.GenerateOrder);
router.get("/order", OrderController.getOrders);
router.patch("/order/:id/cancel", OrderController.cancelOrder);
router.patch("/order/:orderId/item/:itemId/cancel", OrderController.cancelOrderItem);

//payment
router.post('/order/payment/razorpay',OrderController.razorPaymentController)
router.post('/order/razorpay/verifypayment',OrderController.verifyPayment)
router.post('/order/razorpay/payment-failed',OrderController.recordPaymentFailure)
router.get('/order/:orderId/payment-status',OrderController.getPaymentStatus)
router.post('/order/cod/sendOtp',OrderController.SendCodOtp)
router.post('/order/cod/veirfyOtp',OrderController.verifyCodOtp)
router.post('/order/:id/pay-wallet',OrderController.payByWallet)


//return
router.get('/order/return',ReturnController.getUserReturns)


module.exports = router