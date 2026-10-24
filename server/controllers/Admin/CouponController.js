const CouponService = require("../../services/CouponService");
const { couponValidation } = require("../../utils/validation");
const BaseController = require("../baseController");


class CouponController extends BaseController{


    static addCoupon = BaseController.asyncHandler(
        async(req,res)=>{
            const validatedData = BaseController.validateRequest(couponValidation,req.body)

            
            const result = await CouponService.addCoupon(validatedData) 


 BaseController.sendSuccessResponse(
            res,
            `succefully added coupon ${req.body.code}`,
            null,
            201
        );
        }
    )
}


module.exports = CouponController