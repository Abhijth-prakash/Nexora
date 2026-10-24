const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const CouponController = require('../../controllers/Admin/CouponController')


router.post('/coupon',CouponController.addCoupon)


router.use(authenticateAdmin)

