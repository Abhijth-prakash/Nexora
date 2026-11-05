const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "damaged",
        "wrong_item",
        "defective",
        "not_as_described",
        "size_issue",
        "changed_mind",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "pickup_scheduled",
        "picked_up",
        "received",
        "refunded",
        "cancelled",
      ],
      default: "requested",
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // Refund details
    refund: {
      amount: { type: Number, default: 0, min: 0 },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
           method: {
        type: String,
        enum: ["wallet"],
        default: "wallet",
      },
      refundedAt: { type: Date, default: null },
    },

    trackingDates: {
      requested: { type: Date, default: Date.now },
      approved: { type: Date, default: null },
      rejected: { type: Date, default: null },
      pickedUp: { type: Date, default: null },
      received: { type: Date, default: null },
      refunded: { type: Date, default: null },
    },
  },
  { timestamps: true }
);


returnSchema.index({ user: 1, createdAt: -1 });
returnSchema.index({ status: 1 });

returnSchema.index(
  { order: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["requested", "approved", "pickup_scheduled", "picked_up", "received"] },
    },
  }
);
const Return = mongoose.model("Return", returnSchema);

module.exports = Return;