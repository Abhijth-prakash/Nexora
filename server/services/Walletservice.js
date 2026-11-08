const Wallet = require("../models/Wallet")
const logger = require("../utils/logger")

class WalletService{

static async getWallet(user, { page = 1, limit = 10 } = {}) {
  try {
    const userId = user._id || user;

    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .populate("user", "name email")
      .lean();

    const all = wallet.transactions;

    const sum = (type) =>
      all.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

    const start = (page - 1) * limit;
    const transactions = [...all].reverse().slice(start, start + limit); // newest first

    const totalPages = Math.max(1, Math.ceil(all.length / limit));

    logger.info(`Wallet fetched for user ${userId} (page ${page})`);

    return {
      ...wallet,
      transactions,
      totalAdded: sum("credit"),
      totalSpent: sum("debit"),
      pagination: {
        page,
        limit,
        total: all.length,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    logger.error("Failed to get wallet", error);
    throw error;
  }
}



 //refuund from canceling 
  static async creditRefund({ userId, orderId, amount, session }) {
  try {
    if (!amount || amount <= 0) {
      throw new ValidationError("Refund amount must be greater than 0");
    }

    // make sure the wallet exists
    await Wallet.updateOne(
      { user: userId },
      { $setOnInsert: { balance: 0, transactions: [] } },
      { upsert: true, session }
    );

    // credit only if this order has no refund entry yet
    const wallet = await Wallet.findOneAndUpdate(
      {
        user: userId,
        transactions: {
          $not: { $elemMatch: { order: orderId, reason: "refund" } },
        },
      },
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            type: "credit",
            reason: "refund",
            amount,
            order: orderId,
            createdAt: new Date(),
          },
        },
      },
      { new: true, session }
    );

    if (!wallet) {
      logger.warn("Refund already credited, skipping", {
        userId,
        orderId,
      });
      return false;
    }

    logger.info("Refund credited to wallet", {
      userId,
      orderId,
      amount,
      newBalance: wallet.balance,
    });

    return true;
  } catch (error) {
    logger.error("Failed to credit refund to wallet", {
      userId,
      orderId,
      amount,
      error: error.message,
      stack: error.stack,
    });

    // IMPORTANT: always rethrow so the transaction rolls back
    throw error;
  }
}



}


module.exports = WalletService