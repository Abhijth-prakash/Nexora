const UserproductService = require("../../services/UserproductService");
const BaseController = require("../baseController")

class ProductsController extends BaseController{


    //get products
    static getProducts = BaseController.asyncHandler(
        async(req,res)=>{
            const limit = req.query.limit
            const slug = req.query.slug

           const result =  await UserproductService.getProducts(limit,slug)

          return this.sendSuccessResponse(
      res,
      "products  fetched successfully",
      result,
      200
    );
        }
    )

    static getCategories = BaseController.asyncHandler(
        async(req,res)=>{

                const limit = req.query.limit
               const result = await UserproductService.getCategories(limit)


                return this.sendSuccessResponse(
      res,
      "categories  fetched successfully",
      result,
      200
    );


        }
    )

}


module.exports = ProductsController