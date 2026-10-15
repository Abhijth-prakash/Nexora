const UserproductService = require("../../services/UserproductService");
const BaseController = require("../baseController")

class ProductsController extends BaseController{

    static getProducts = BaseController.asyncHandler(
        async(req,res)=>{

            await UserproductService.getProducts()

          return this.sendSuccessResponse(
      res,
      "products  fetched successfully",
      null,
      200
    );
        }
    )

}


module.exports = ProductsController