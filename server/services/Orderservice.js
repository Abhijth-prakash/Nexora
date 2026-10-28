const Cart = require("../models/Cart")
const logger = require("../utils/logger")
const { NotFoundError, ConflictError,ValidationError } = require("../utils/errors");
const { Coupon,CouponRedemption } = require("../models/Coupon");
const Address = require("../models/Address");
const CartService = require("./cartService");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const StockReservation = require("../models/StockReservation");

class OrderService{

    //stockvalidation
   static async StockValidation(user) {
    try {
        const cart = await Cart.findOne({
            user: user
        }).populate("items.product");

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        if (!cart.items.length) {
            throw new ConflictError("Your cart is empty");
        }

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                throw new NotFoundError("Product not found");
            }

            let availableStock;

            if (item.variantId) {
                const variant = product.variants.id(item.variantId);

                if (!variant) {
                    throw new NotFoundError(
                        `Variant not found for ${product.name}`
                    );
                }

                availableStock = variant.stock;
            } else {
                availableStock = product.stock;
            }

            if (availableStock < item.quantity) {
                throw new ConflictError(
                    `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}`
                );
            }
        }


        logger.info('stock validation succesfull')
        return cart;
    
    } catch (error) {
        logger.error("Failed to place the order", { error });
        throw error;
    }
}



    //order summary
  static async orderSummary(user, couponId) {
  try {
    const cart = await Cart.findOne({ user }).populate("items.product");

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((total, item) => {
      const product = item.product;

      if (!product) {
        throw new NotFoundError("Product in cart not found");
      }

      return total + product.price * item.quantity;
    }, 0);

    let discount = 0;
    let finalAmount = subtotal;
    let coupon = null;

    if (couponId) {
      coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new NotFoundError("Coupon not found");
      }

      // Calculate discount
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;

        if (coupon.maxDiscount !== null) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }

      // Discount cannot exceed subtotal
      discount = Math.min(discount, subtotal);
      discount = Math.round(discount * 100) / 100;

      finalAmount = subtotal - discount;
    }

    return {
      subtotal,
      discount,
      finalAmount,
      coupon: coupon
        ? {
            _id: coupon._id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
          }
        : null,
    };
  } catch (error) {
    logger.error("Failed to calculate order summary", { error });
    throw error;
  }
}


//release the user's existing active reservations (NEW)
static async releaseUserReservations(user) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      let reservation;

      // findOneAndDelete is atomic, so stock is restored only once
      while (
        (reservation = await StockReservation.findOneAndDelete(
          { user, status: "reserved" },
          { session }
        ))
      ) {
        for (const item of reservation.items) {
          let result;

          if (item.variantId) {
            result = await Product.updateOne(
              {
                _id: item.product,
                "variants._id": item.variantId,
              },
              {
                $inc: {
                  "variants.$.stock": item.quantity,
                },
              },
              { session }
            );
          } else {
            result = await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );
          }

          if (result.modifiedCount !== 1) {
            throw new Error(
              `Failed to restore stock for product ${item.product}`
            );
          }
        }
      }
    });
  } catch (error) {
    logger.error("Failed to release previous reservations", { error });
    throw error;
  } finally {
    await session.endSession();
  }
}


//orderVerification
static async orderVerification(user, data) {
  const session = await mongoose.startSession();

  try {
    const { addressId, couponId } = data;

    const address = await Address.findOne({
      _id: addressId,
      user,
    });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    // CHANGED: release any earlier reservation first, so repeated calls don't drain stock
    await this.releaseUserReservations(user);

    const cart = await this.StockValidation(user);

 
    const summary = await this.orderSummary(user, couponId);

    const reservationId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await session.withTransaction(async () => {
      const reservationItems = [];

      for (const item of cart.items) {
        const product = item.product;

        if (!product) {
          throw new NotFoundError("Product not found");
        }

        const quantity = item.quantity;
        let stockUpdate;

        if (item.variantId) {
       
          stockUpdate = await Product.updateOne(
            {
              _id: product._id,
              variants: {
                $elemMatch: {
                  _id: item.variantId,
                  stock: { $gte: quantity },
                },
              },
            },
            {
              $inc: {
                "variants.$.stock": -quantity,
              },
            },
            { session }
          );
        } else {
        
          stockUpdate = await Product.updateOne(
            {
              _id: product._id,
              stock: { $gte: quantity },
            },
            {
              $inc: { stock: -quantity },
            },
            { session }
          );
        }

        if (stockUpdate.modifiedCount !== 1) {
          throw new ConflictError(
            `Insufficient stock for ${product.name}. Please refresh your cart.`
          );
        }

        reservationItems.push({
          product: product._id,
          variantId: item.variantId || null,
          quantity,
        });
      }

      await StockReservation.create(
        [
          {
            _id: reservationId,
            user,
            items: reservationItems,
            status: "reserved",
            expiresAt,
          },
        ],
        { session }
      );
    });

    return {
      reservationId,
      expiresAt,
      address,
      summary,
    };
  } catch (error) {
    logger.error("Failed to verify checkout details", { error });
    throw error;
  } finally {
    await session.endSession();
  }
}


//delete expired
static async expireReservation(reservationId) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const reservation = await StockReservation.findOne({
        _id: reservationId,
        status: "reserved",
        expiresAt: { $lte: new Date() },
      }).session(session);

      if (!reservation) return;

   
      const deleted = await StockReservation.deleteOne({
        _id: reservationId,
        status: "reserved",
        expiresAt: { $lte: new Date() },
      }).session(session);

      if (deleted.deletedCount !== 1) return;

      // Restore the reserved stock.
      for (const item of reservation.items) {
        let result;

        if (item.variantId) {
          result = await Product.updateOne(
            {
              _id: item.product,
              "variants._id": item.variantId,
            },
            {
              $inc: {
                "variants.$.stock": item.quantity,
              },
            },
            { session }
          );
        } else {
          result = await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session }
          );
        }

        if (result.modifiedCount !== 1) {
          throw new Error(
            `Failed to restore stock for product ${item.product}`
          );
        }
      }
    });
  } catch (error) {
    logger.error("Failed to expire stock reservation", {
      reservationId,
      error,
    });
    throw error;
  } finally {
    await session.endSession();
  }
}

}



module.exports = OrderService