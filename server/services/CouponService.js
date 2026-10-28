
const logger = require("../utils/logger");
const { Coupon,CouponRedemption } = require("../models/Coupon");
const { NotFoundError, ConflictError,ValidationError } = require("../utils/errors");
const {Category} = require("../models/Category");

class CouponService {
    // add coupon
    static async addCoupon(data) {
        try {
            const coupon = await Coupon.findOne({ code: data.code });

            if (coupon) {
                throw new ConflictError("Coupon already present");
            }

            const startDate = new Date();

            const newCoupon = new Coupon({
                code: data.code,
                description: data.description,
                discountType: data.discountType,
                discountValue: data.discountValue,
                maxDiscount: data.maxDiscount ?? null,
                minOrderAmount: data.minOrderAmount ?? 0,
                startDate,
                expiryDate: data.expiryDate,
                usageLimit: data.usageLimit ?? null,
                usedCount: 0,
                perUserLimit: data.perUserLimit ?? 1,
                applicableCategories: data.applicableCategories ?? [],
                isActive: data.isActive ?? true,
            });

            await newCoupon.save();

            logger.info(`Successfully added new coupon ${data.code}`);

            return true;
        } catch (error) {
            logger.error("Failed to add coupon", error);
            throw error;
        }
    }

    // active toggle
    static async activeToggle(id) {
        try {
            const coupon = await Coupon.findById(id);

            if (!coupon) {
                throw new NotFoundError("Coupon not found");
            }

            coupon.isActive = !coupon.isActive;

            await coupon.save();

            logger.info(
                `Successfully ${coupon.isActive ? "activated" : "deactivated"} coupon ${coupon.code}`
            );

            return true;
        } catch (error) {
            logger.error("Failed to toggle coupon active status", error);
            throw error;
        }
    }

    // delete coupon
    static async delete(id) {
        try {
            const coupon = await Coupon.findById(id);

            if (!coupon) {
                throw new NotFoundError("Coupon not found");
            }

            await Coupon.findByIdAndDelete(id);

            logger.info("Coupon deleted successfully", {
                couponId: id,
                code: coupon.code,
            });

            return true;
        } catch (error) {
            logger.error("Error deleting coupon:", {
                id,
                error: error.message,
            });
            throw error;
        }
    }

    // update coupon
    static async update(id, data) {
        try {
            const coupon = await Coupon.findById(id);

            if (!coupon) {
                throw new NotFoundError("Coupon not found");
            }

            const {
                code,
                description,
                discountType,
                discountValue,
                minOrderAmount,
                maxDiscount,
                expiryDate,
                usageLimit,
                perUserLimit,
                applicableCategories,
                isActive,
            } = data;

            if (code && code.toUpperCase() !== coupon.code) {
                const existingCoupon = await Coupon.findOne({
                    code: code.trim().toUpperCase(),
                });

                if (
                    existingCoupon &&
                    existingCoupon._id.toString() !== id
                ) {
                    throw new ConflictError(
                        "Coupon with this code already exists"
                    );
                }
            }

            if (code !== undefined) coupon.code = code;
            if (description !== undefined) coupon.description = description;
            if (discountType !== undefined) coupon.discountType = discountType;
            if (discountValue !== undefined) coupon.discountValue = discountValue;
            if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
            if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
            if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
            if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
            if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;

            if (applicableCategories !== undefined) {
                coupon.applicableCategories = applicableCategories;
            }

            if (isActive !== undefined) coupon.isActive = isActive;

            await coupon.save();

            logger.info("Coupon updated successfully", {
                couponId: coupon._id,
                code: coupon.code,
            });

            return true;
        } catch (error) {
            logger.error("Error updating coupon:", {
                id,
                error: error.message,
            });

            if (error.code === 11000) {
                throw new ConflictError(
                    "Coupon with this code already exists"
                );
            }

            throw error;
        }
    }




    // get all coupons
    static async getAllCoupons(page = 1, limit = 10, search = "", filter = "") {
        try {
            const currentPage = Math.max(1, Number(page) || 1);
            const pageLimit = Math.max(1, Number(limit) || 10);
            const skip = (currentPage - 1) * pageLimit;

            const query = {};

            // Search by coupon code or description
            if (search && search.trim()) {
                query.$or = [
                    { code: { $regex: search.trim(), $options: "i" } },
                    { description: { $regex: search.trim(), $options: "i" } },
                ];
            }

            // Filter by active status
            if (filter === "active") {
                query.isActive = true;
            } else if (filter === "inactive") {
                query.isActive = false;
            }

            const [coupons, totalCoupons] = await Promise.all([
                Coupon.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageLimit)
                    .lean(),

                Coupon.countDocuments(query),
            ]);

            const totalPages = Math.ceil(totalCoupons / pageLimit);

            logger.info("Coupons fetched successfully", {
                page: currentPage,
                totalCoupons,
            });

            return {
                coupons,
                totalPages,
                currentPage,
                totalCoupons,
            };
        } catch (error) {
            logger.error("Failed to fetch coupons", {
                error: error.message,
            });

            throw error;
        }
    }

    //get coupon by id
    static async getByid(id){
        try{
            const coupon =  await Coupon.findById(id)

            if(!coupon){
                throw new NotFoundError('coupon not found')
            }


            logger.info(`fetched coupon ${coupon.code} succefullly`)
            return coupon


        }catch(error){
            logger.error('failed to get coupon')
            throw error
        }
    }



    //get coupons for user

static async getCouponsForUser() {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: new Date() },
            expiryDate: { $gt: new Date() },
        });

        logger.info("Coupons fetched for user");

        return coupons;
    } catch (error) {
        logger.error("Failed to get coupons for user", error);
        throw error;
    }
}

//validateCoupon

static async validateCoupon(user, data) {
  try {
    const coupon = await Coupon.findById(data.couponID);

    if (!coupon) {
      throw new NotFoundError("Coupon not found");
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new ValidationError("Coupon is inactive");
    }

    if (coupon.startDate > now) {
      throw new ValidationError("Coupon is not active yet");
    }

    if (coupon.expiryDate < now) {
      throw new ValidationError("Coupon has expired");
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new ConflictError(
        "Coupon usage limit has been reached"
      );
    }

    const redemptionCount = await CouponRedemption.countDocuments({
      coupon: coupon._id,
      user: user,
    });

    if (redemptionCount >= coupon.perUserLimit) {
      throw new ConflictError(
        "You have already reached the usage limit for this coupon"
      );
    }

    const orderAmount = Number(data.subtotal);

    if (!Number.isFinite(orderAmount) || orderAmount < 0) {
      throw new ValidationError("Invalid order subtotal");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new ValidationError(
        `Minimum order amount of ${coupon.minOrderAmount} is required to use this coupon`
      );
    }



   const invalidCategories = data.category.filter(
  (categoryId) =>
    !coupon.applicableCategories.some(
      (applicableCategory) =>
        categoryId.toString() === applicableCategory.toString()
    )
);

if (
  coupon.applicableCategories.length > 0 &&
  invalidCategories.length > 0
) { 
  const categories = await Category.find({
    _id: { $in: invalidCategories },
  }).select("name");

  const categoryNames = categories.map((category) => category.name);

  throw new ConflictError(
    `Coupon is not applicable to these categories: ${categoryNames.join(", ")}`
  );
}




    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;

      if (
        coupon.maxDiscount !== null &&
        coupon.maxDiscount !== undefined &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Discount must not exceed the order amount.
    discount = Math.min(discount, orderAmount);

    // Round to two decimal places.
    discount = Math.round((discount + Number.EPSILON) * 100) / 100;

    logger.info("Coupon validated successfully", {
      code: coupon.code,
      orderAmount,
      discount,
    });

    return {
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
      },
      discount,
      finalAmount: Math.round(
        (orderAmount - discount + Number.EPSILON) * 100
      ) / 100,
    };
  } catch (error) {
    logger.error(
      `Failed to validate coupon ${data.couponID}: ${error.message}`
    );

    throw error;
  }
}



}

module.exports = CouponService;
