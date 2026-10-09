const ProductValidation = require("../../utils/validation");
const BaseController = require("../baseController");
const ProductService = require('../../services/ProductService')



class ProductController extends BaseController{


    //adding product
    static addProduct = BaseController.asyncHandler(
        async(req,res)=>{
            const validatedData = BaseController.validateRequest(ProductValidation,req.body)
            const result =  await ProductService.addProduct(validatedData,req.files)

              BaseController.sendSuccessResponse(
                        res,
                        ` successfully added product`  ,
                        result,
                        200
                    )
        }
    )
}

//visible toggling



module.exports = ProductController