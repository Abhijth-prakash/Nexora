const {ProductValidation,Idvalidation, UpdateProductValidation} = require("../../utils/validation");
const BaseController = require("../baseController");
const ProductService = require('../../services/ProductService')



class ProductController extends BaseController{


    //adding product
static addProduct = BaseController.asyncHandler(
    async (req, res) => {
        if (req.body.size) {
            req.body.size = JSON.parse(req.body.size);
        }

        const validatedData = BaseController.validateRequest(
            ProductValidation,
            req.body
        );

        const result = await ProductService.addProduct(
            validatedData,
            req.files
        );

        BaseController.sendSuccessResponse(
            res,
            'Successfully added product',
            result,
            200
        );
    }
);


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
            null,
            200
        );
    }
);


//update product

static UpdateProduct = BaseController.asyncHandler(
    async (req,res)=>{
        console.log(req.body)
         if (req.body.size) {
            req.body.size = JSON.parse(req.body.size);
        }

        const id =  req.params.id
         const data = BaseController.validateRequest(
            UpdateProductValidation,req.body
        );

        await ProductService.updateProduct(id,data,req.files)
         BaseController.sendSuccessResponse(
            res,
            'Product updated successfully',
            null,
            200
        );

    }
)
}





module.exports = ProductController