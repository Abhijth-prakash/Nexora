const CouponService = require("../../services/CouponService");
const { couponValidation } = require("../../utils/validation");
const BaseController = require("../baseController");


class CouponController extends BaseController{

    //addCoupon
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


    static getCoupons = BaseController.asyncHandler(
    async (req, res) => {
        const {
            page = 1,
            limit = 10,
            search = "",
            filter = "",
        } = req.query;

        const result = await CouponService.getAllCoupons(
            page,
            limit,
            search,
            filter
        );

        BaseController.sendSuccessResponse(
            res,
            "Successfully fetched coupons",
            result,
            200
        );
    }
);
}


module.exports = CouponController