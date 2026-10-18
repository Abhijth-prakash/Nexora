const UserproductService = require("../../services/UserproductService");
const BaseController = require("../baseController")

class ProductsController extends BaseController{


    //get products
    static getProducts = BaseController.asyncHandler(
        async(req,res)=>{

            const limit = req.query.limit
            const slug = req.query.slug
            const page = req.query.page
            const subCategory = req.query.subCategory
            const category = req.query.category
            const brand = req.query.brand ? req.query.brand.split(',') : []
            const minprice = req.query.minprice
            const maxprice = req.query.maxprice
            const sort = req.query.sort

            const result = await UserproductService.getProducts(limit,slug,page,subCategory,category,brand,minprice,maxprice,sort)

            return this.sendSuccessResponse(
      res,
      "products  fetched successfully",
      result,
      200
    );
        }
    )

    //getproductByid
    static GetProductbyid = BaseController.asyncHandler(
      async (req, res) => {
        const id = req.query.id;
    
        const result = await UserproductService.getProductByid(id);
    
        BaseController.sendSuccessResponse(
          res,
          "Product fetched successfully by id for userside",
          result,
          200
        );
      }
    );



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



    //getcategoryTree
    static getCategoryTree = BaseController.asyncHandler(
    async (req, res) => {
        const result = await UserproductService.getCategoryTree()
        return this.sendSuccessResponse(res, "category tree fetched successfully", result, 200)
    }
)

}


module.exports = ProductsController