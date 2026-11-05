const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    razorpayRefundId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true, // Paise
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },

    reason: {
      type: String,
      required: true,
    },

    initiatedBy: {
      type: String,
      enum: ["user", "admin", "system"],
      required: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Refund = mongoose.model("Refund", refundSchema);

module.exports = Refund;