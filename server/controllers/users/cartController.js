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



//qunatity increase or decrese 
static updateCartItem = BaseController.asyncHandler(async (req, res) => {
  const cart = await CartService.updateCartItem(
    req.userId,
    req.params.itemId,
    req.body.quantity
  );
  return this.sendSuccessResponse(res, "Cart updated successfully", cart, 200);
});


//merging guest cart

static mergeGuestCart = BaseController.asyncHandler(
  async (req, res) => {
    const { items } = req.body;

    
    const skippedItems  =
      await CartService.mergeGuestCart(req.userId, items);

    return this.sendSuccessResponse(
      res,
      "Guest cart merged successfully",
        skippedItems,
      200
    );
  }
);



}

module.exports = CartController;