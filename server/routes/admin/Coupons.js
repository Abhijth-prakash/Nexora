const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const CouponController = require('../../controllers/Admin/CouponController')

router.use(authenticateAdmin)



router.post("/coupon", CouponController.addCoupon);
router.get("/coupon", CouponController.getCoupons);
router.get("/coupon/:id", CouponController.getByid);
router.patch("/coupon/:id/toggle", CouponController.activeToggle);
router.patch("/coupon/:id", CouponController.update);
router.delete("/coupon/:id", CouponController.delete);


module.exports = router

