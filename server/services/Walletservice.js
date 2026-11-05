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

}


module.exports = WalletService