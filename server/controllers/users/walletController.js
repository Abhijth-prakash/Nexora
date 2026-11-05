const WalletService = require("../../services/Walletservice")
const BaseController = require("../baseController")


class WalletController extends BaseController{
static getWallet = BaseController.asyncHandler(
  async (req, res) => {
    const user = req.userId;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const wallet = await WalletService.getWallet(user, { page, limit });

    BaseController.logAction(`fetched wallet for user ${user} (page ${page})`);

    return this.sendSuccessResponse(
      res,
      "wallet fetched successfully",
      wallet,
      200
    );
  }
);

}


module.exports = WalletController