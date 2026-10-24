
const logger = require("../utils/logger");
const { Coupon } = require("../models/Coupon");
const { NotFoundError, ConflictError } = require("../utils/errors");

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

            return coupon;
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

            return coupon;
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

}

module.exports = CouponService;
