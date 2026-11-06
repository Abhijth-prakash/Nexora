const mongoose = require("mongoose");

const logger = require("../utils/logger");
const Order = require("../models/Order");
const Return = require("../models/Return");
const Product = require("../models/Product");
const Wallet = require("../models/Wallet");

const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");

class ReturnService {
  // ==========================================
  // GENERATE RETURN REQUEST
  // ==========================================

  static async generateReturn(user, data) {
    const session = await mongoose.startSession();

    try {
      const { orderId, reasonForreturning, description } = data;

      if (!mongoose.isValidObjectId(orderId)) {
        throw new ValidationError("Invalid order");
      }

      let newReturn;

      await session.withTransaction(async () => {
        const order = await Order.findById(orderId).session(session);

        if (!order) {
          throw new NotFoundError("Order not found");
        }

        // Verify order ownership
        if (order.user.toString() !== user.toString()) {
          throw new NotFoundError("Order not found");
        }

        // Only delivered orders can be returned
        if (order.orderStatus !== "delivered") {
          throw new ValidationError(
            "Only delivered orders can be returned"
          );
        }

        // Validate delivery date
        const deliveredAt = order.trackingDates?.delivered;

        if (!deliveredAt) {
          throw new ValidationError(
            "Delivery date not found for this order"
          );
        }

        // Seven-day return window
        const RETURN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

        const elapsedTime =
          Date.now() - new Date(deliveredAt).getTime();

        if (elapsedTime < 0 || elapsedTime > RETURN_WINDOW_MS) {
          throw new ValidationError(
            "Return window of 7 days has expired"
          );
        }

        // Check for an existing active return
        const existingReturn = await Return.findOne({
          order: order._id,
          status: {
            $nin: ["rejected", "cancelled"],
          },
        }).session(session);

        if (existingReturn) {
          throw new ConflictError(
            "A return request already exists for this order"
          );
        }

        // Create return request
        const [createdReturn] = await Return.create(
          [
            {
              order: order._id,
              user: order.user,
              reason: reasonForreturning,
              description: description || null,

              refund: {
                amount: order.totalAmount,
                status: "pending",
                method: "wallet",
              },
            },
          ],
          { session }
        );

        // Link return to order
        order.return = createdReturn._id;
        order.orderStatus = "return_requested";
        order.trackingDates.returnRequested = new Date();

        await order.save({ session });

        newReturn = createdReturn;
      });

      return newReturn;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictError(
          "A return request already exists for this order"
        );
      }

      logger.error("Failed to generate return", {
        error: error.message,
      });

      throw error;
    } finally {
      await session.endSession();
    }
  }

  // ==========================================
  // UPDATE RETURN STATUS
  // ==========================================

  static async updateReturnStatus(returnId, status, data = {}) {
    const session = await mongoose.startSession();

    try {
      const { adminNote, rejectionReason } = data;

      if (!mongoose.isValidObjectId(returnId)) {
        throw new ValidationError("Invalid return");
      }

      const allowedStatuses = [
        "approved",
        "rejected",
        "pickup_scheduled",
        "picked_up",
        "received",
      ];

      if (!allowedStatuses.includes(status)) {
        throw new ValidationError("Invalid return status");
      }

      if (
        status === "rejected" &&
        !rejectionReason?.trim()
      ) {
        throw new ValidationError(
          "Rejection reason is required"
        );
      }

      let updatedReturn;

      await session.withTransaction(async () => {
        // Get current return
        const existingReturn = await Return.findById(
          returnId
        ).session(session);

        if (!existingReturn) {
          throw new NotFoundError("Return not found");
        }

        // Allowed transitions
        const transitions = {
          requested: ["approved", "rejected"],
          approved: ["pickup_scheduled", "picked_up"],
          pickup_scheduled: ["picked_up"],
          picked_up: ["received"],
        };

        const currentStatus = existingReturn.status;

        if (!transitions[currentStatus]?.includes(status)) {
          throw new ConflictError(
            `Return cannot move from ${currentStatus} to ${status}`
          );
        }

        // Atomically update only if the status has not changed
        const trackingDateKeys = {
          approved: "approved",
          rejected: "rejected",
          picked_up: "pickedUp",
          received: "received",
        };

        const updateFields = {
          status,
        };

        const dateKey = trackingDateKeys[status];

        if (dateKey) {
          updateFields[`trackingDates.${dateKey}`] = new Date();
        }

        if (adminNote?.trim()) {
          updateFields.adminNote = adminNote.trim();
        }

        if (status === "rejected") {
          updateFields.rejectionReason =
            rejectionReason.trim();
        }

        const ret = await Return.findOneAndUpdate(
          {
            _id: returnId,
            status: currentStatus,
          },
          {
            $set: updateFields,
          },
          {
            new: true,
            session,
            runValidators: true,
          }
        );

        if (!ret) {
          throw new ConflictError(
            "Return status was already updated"
          );
        }

        // Get associated order
        const order = await Order.findById(ret.order).session(
          session
        );

        if (!order) {
          throw new NotFoundError("Order not found");
        }

        // ==========================================
        // REJECTED
        // ==========================================

        if (status === "rejected") {
          order.orderStatus = "delivered";
          order.return = null;

          await order.save({ session });
        }

        // ==========================================
        // RECEIVED
        // ==========================================

        if (status === "received") {
          // Restore stock
          await this.restoreStock(order, session);

          // Update order
          order.orderStatus = "returned";

          await order.save({ session });

          // Credit wallet within the same transaction
          await this.creditReturnRefund(ret._id, session);
        }

        updatedReturn = await Return.findById(returnId).session(
          session
        );
      });

      return updatedReturn;
    } catch (error) {
      logger.error("Failed to update return status", {
        returnId,
        status,
        error: error.message,
      });

      throw error;
    } finally {
      await session.endSession();
    }
  }

  // ==========================================
  // RESTORE STOCK
  // ==========================================

  static async restoreStock(order, session) {
    try {
      if (!order.items || order.items.length === 0) {
        throw new ValidationError(
          "No order items found for stock restoration"
        );
      }

      // Verify all referenced products exist
      const productIds = [
        ...new Set(
          order.items.map((item) => item.product.toString())
        ),
      ];

      const products = await Product.find({
        _id: { $in: productIds },
      }).session(session);

      const productMap = new Map(
        products.map((product) => [
          product._id.toString(),
          product,
        ])
      );

      const stockOps = order.items.map((item) => {
        const productId = item.product.toString();
        const product = productMap.get(productId);

        if (!product) {
          throw new NotFoundError(
            `Product ${productId} not found during stock restoration`
          );
        }

        if (!item.quantity || item.quantity <= 0) {
          throw new ValidationError(
            "Invalid product quantity in order"
          );
        }

        // Variant stock restoration
        if (item.variantId) {
          const variantExists = product.variants?.some(
            (variant) =>
              variant._id.toString() ===
              item.variantId.toString()
          );

          if (!variantExists) {
            throw new NotFoundError(
              `Variant not found for product ${productId}`
            );
          }

          return {
            updateOne: {
              filter: {
                _id: item.product,
                "variants._id": item.variantId,
              },
              update: {
                $inc: {
                  "variants.$[variant].stock": item.quantity,
                },
              },
              arrayFilters: [
                {
                  "variant._id": item.variantId,
                },
              ],
            },
          };
        }

        // Normal product stock restoration
        return {
          updateOne: {
            filter: {
              _id: item.product,
            },
            update: {
              $inc: {
                stock: item.quantity,
              },
            },
          },
        };
      });

      const result = await Product.bulkWrite(stockOps, {
        session,
      });

      if (result.matchedCount !== stockOps.length) {
        throw new ConflictError(
          "Some products could not be updated during stock restoration"
        );
      }

      logger.info(
        `Stock restored successfully for order ${order._id}`
      );
    } catch (error) {
      logger.error("Failed to restore stock", {
        orderId: order._id,
        error: error.message,
      });

      throw error;
    }
  }

  // ==========================================
  // CREDIT RETURN REFUND TO WALLET
  // ==========================================

  static async creditReturnRefund(returnId, session) {
    try {
      // Claim refund atomically
      // Only received returns can be refunded
      const claimed = await Return.findOneAndUpdate(
        {
          _id: returnId,
          status: "received",
          "refund.status": {
            $in: ["pending", "failed"],
          },
        },
        {
          $set: {
            "refund.status": "processing",
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!claimed) {
        const existing = await Return.findById(
          returnId
        ).session(session);

        if (!existing) {
          throw new NotFoundError("Return not found");
        }

        if (existing.refund?.status === "completed") {
          logger.info(
            `Refund already completed for return ${returnId}`
          );

          return existing;
        }

        throw new ConflictError(
          "Return is not eligible for refund"
        );
      }

      const amount = claimed.refund?.amount;

      if (!amount || amount <= 0) {
        throw new ValidationError(
          "Refund amount is invalid"
        );
      }

      // Credit wallet
      await Wallet.findOneAndUpdate(
        {
          user: claimed.user,
        },
        {
          $setOnInsert: {
            user: claimed.user,
          },

          $inc: {
            balance: amount,
          },

          $push: {
            transactions: {
              type: "credit",
              reason: "order_return_refund",
              amount,
              order: claimed.order,
            },
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          session,
        }
      );

      // Mark refund completed
      const now = new Date();

      const completedReturn = await Return.findOneAndUpdate(
        {
          _id: returnId,
          status: "received",
          "refund.status": "processing",
        },
        {
          $set: {
            status: "refunded",
            "refund.status": "completed",
            "refund.refundedAt": now,
            "trackingDates.refunded": now,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!completedReturn) {
        throw new ConflictError(
          "Failed to complete return refund"
        );
      }

      logger.info(
        `Refund of ${amount} credited to user ${claimed.user} for return ${returnId}`
      );

      return completedReturn;
    } catch (error) {
      logger.error("Failed to credit return refund", {
        returnId,
        error: error.message,
      });

      throw error;
    }
  }

  // ==========================================
  // REFUND TO WALLET (STANDALONE / RETRY)
  // ==========================================

  static async refundToWallet(returnId) {
    const session = await mongoose.startSession();

    try {
      if (!mongoose.isValidObjectId(returnId)) {
        throw new ValidationError("Invalid return");
      }

      await session.withTransaction(async () => {
        const returnRequest = await Return.findById(
          returnId
        ).session(session);

        if (!returnRequest) {
          throw new NotFoundError("Return not found");
        }

        // Idempotency check
        if (returnRequest.refund?.status === "completed") {
          logger.info(
            `Refund already completed for return ${returnId}`
          );

          return;
        }

        if (returnRequest.status !== "received") {
          throw new ValidationError(
            "Only received returns can be refunded"
          );
        }

        await this.creditReturnRefund(returnId, session);
      });

      return await Return.findById(returnId);
    } catch (error) {
      logger.error("Failed to refund to wallet", {
        returnId,
        error: error.message,
      });

      throw error;
    } finally {
      await session.endSession();
    }
  }



  //get all returns
 static async getAllReturns() {
  try {
    const returns = await Return.find()
      .populate("user", "name email")
      .populate("order")
      .sort({ createdAt: -1 });
    logger.info(`returns fetched for admin`)
    return returns;
  } catch (error) {
    logger.error('failed to get returns')
    throw error;
  }
}

//get orders for users
static async getReturns(user) {
  try {
    const returns = await Return.find({ user })
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "order",
        populate: {
          path: "address",
          model: "Address",
        },
      })
      .sort({ createdAt: -1 });

    logger.info(`returns fetched for user ${user}`);
    return returns;
  } catch (error) {
    logger.error(`failed to get returns for user ${user}`, error);
    throw error;
  }
}


}

module.exports = ReturnService;