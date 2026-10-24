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

    //getcoupns
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


//activeToggle
static activeToggle = BaseController.asyncHandler(
    async (req, res) => {
        const { id } = req.params;

        const result = await CouponService.activeToggle(id);

        BaseController.sendSuccessResponse(
            res,
            `Successfully ${result.isActive ? "activated" : "deactivated"} coupon ${result.code}`,
            result,
            200
        );
    }
);

//delete coupon
static delete = BaseController.asyncHandler(async (req, res) => {
  const { id } = req.params;

  await CouponService.delete(id);

  BaseController.sendSuccessResponse(
    res,
    "Coupon deleted successfully",
    null,
    200
  );
});

//update coupon
static update = BaseController.asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  await CouponService.update(id, data);

  BaseController.sendSuccessResponse(
    res,
    "Coupon updated successfully",
    null,
    200
  );
});

//getByid 
static getByid = BaseController.asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await CouponService.getByid(id);

  BaseController.sendSuccessResponse(
    res,
    "Coupon fetched successfully",
    result,
    200
  );
});
}


module.exports = CouponController