const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    isBuyNow: {
      type: Boolean,
      default: false,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cod"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod","wallet"],
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

orderStatus: {
  type: String,
  enum: [
    "payment_pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "return_requested",
    "returned",
  ],
  default: "payment_pending",
},

    cancelReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin", "system", null],
      default: null,
    },

    return: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
      default: null,
    },

    trackingDates: {
      confirmed: { type: Date, default: null },
      shipped: { type: Date, default: null },
      outForDelivery: { type: Date, default: null },
      delivered: { type: Date, default: null },
      cancelled: { type: Date, default: null },
      returnRequested: { type: Date, default: null },
      returned: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ createdAt: -1 });

// Get populated order
orderSchema.statics.getCart = function (filter = {}) {
  return this.find(filter)
    .populate("user")
    .populate("items.product")
    .populate("address")
    .populate("coupon")
    .populate("return");
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;