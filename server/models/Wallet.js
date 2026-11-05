const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0, min: 0 },

    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        reason: { type: String, enum: ["refund", "order_payment"], required: true },
        amount: { type: Number, required: true, min: 0 },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);