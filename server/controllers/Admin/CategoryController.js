const AdminUserService = require("../../services/AdminUserService");
const CategoryService = require("../../services/Categoryservice");
const { CategoryValidation } = require("../../utils/validation");
const BaseController = require("../baseController");


class CategoryController extends BaseController{

    //addCategory
    static addCategory = BaseController.asyncHandler(
    async (req, res) => {

        const validatedData = BaseController.validateRequest(
            CategoryValidation,
            req.body
        );

        const result = await CategoryService.addCategory(validatedData);

        let message;

        if (result.type === "subcategory") {
            message = `Added new subcategory successfully ${result.name}`;
        } else {
            message = `Added new category successfully ${result.name}`;
        }

        BaseController.sendSuccessResponse(
            res,
            message,
            null,
            200
        );
    }
);

    //get all category

    static getCategories = BaseController.asyncHandler(
        async(req,res)=>{
            const result =await CategoryService.getcategories()

               BaseController.sendSuccessResponse(
            res,
            ` successfully get all categories`  ,
            result,
            200
        )
        }
    )
        
    
}


module.exports = CategoryController