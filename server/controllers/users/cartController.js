const CartService = require("../../services/cartService");
const BaseController = require("../baseController");

class CartController extends BaseController {

//add to cart
  static addtoCart = BaseController.asyncHandler(async (req, res) => {
    const { productId, variantId, size, quantity } = req.body;

    const cart = await CartService.addToCart(req.userId, {
      productId,
      variantId,
      size,
      quantity,
    });

    return this.sendSuccessResponse(
      res,
      "Item added to cart successfully",
      cart,
      200
    );
  });


//get cart
  static getCart = BaseController.asyncHandler(async (req, res) => {

    const user = req.userId
    const cart = await CartService.getCart(req.userId,);

    return this.sendSuccessResponse(
      res,
      `cart successfully fetched for user ${user}`,
      cart,
      200
    );
  });
}

module.exports = CartController;