const {ProductValidation,Idvalidation} = require("../../utils/validation");
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


    //visible toggling

static visibleToggle = BaseController.asyncHandler(
    async (req, res) => {

        const id  = BaseController.validateRequest(
            Idvalidation,
            req.query.id
        );

        const result = await ProductService.visibleToggle(id);

        BaseController.sendSuccessResponse(
            res,
            'Product visibility toggled successfully',
            null,
            200
        );
    }
);


//delete product
static DeleteProduct = BaseController.asyncHandler(
    async (req, res) => {
        const id = BaseController.validateRequest(
            Idvalidation,
            req.params.id
        );

        const result = await ProductService.Delete(id);

        BaseController.sendSuccessResponse(
            res,
            'Product deleted successfully',
            result,
            200
        );
    }
);
}





module.exports = ProductController