const AdminUserService = require("../../services/AdminUserService");
const CategoryService = require("../../services/Categoryservice");
const { CategoryValidation } = require("../../utils/validation");
const BaseController = require("../baseController");


class CategoryController extends BaseController{

    //addCategory
    static addCategorry = BaseController.asyncHandler(
        async(req,res)=>{
            const validatedData = BaseController.validateRequest(CategoryValidation,req.body)
            const result = await CategoryService.addCategory(validatedData)

             BaseController.sendSuccessResponse(
            res,
            `added new category successfully ${result.name}`  ,
            {
                data: result
            },
            200
        )
            
        }
    )
        
    
}


module.exports = CategoryController