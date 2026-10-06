const AdminUserService = require("../../services/AdminUserService");
const CategoryService = require("../../services/Categoryservice");
const { CategoryValidation, Idvalidation } = require("../../utils/validation");
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


    //get category by id

    static getCategory = BaseController.asyncHandler(
        async(req,res)=>{
            const id = req.params.id
            const validateData = BaseController.validateRequest(Idvalidation,id)
            const result = await CategoryService.getCategory(validateData)



               BaseController.sendSuccessResponse(
            res,
            ` successfully get category`  ,
            result,
            200
        )
        }
    )
//delete category

static deleteCategory = BaseController.asyncHandler(
    async(req,res)=>{
        const id = req.params.id
        const validateData = BaseController.validateRequest(Idvalidation,id)

        const result = await CategoryService.deleteCategory(validateData)

          BaseController.sendSuccessResponse(
            res,
            ` successfully deleted category`  ,
            null,
            200
        )

    }
)

//edit category

static editCategory = BaseController.asyncHandler(
    async(req,res)=>{
        const id = req.params.id
        const validateData = BaseController.validateRequest(CategoryValidation,req.body)

        const result = await CategoryService.UpdateCategory(validateData,id)

          BaseController.sendSuccessResponse(
            res,
            ` successfully updated category`  ,
            null,
            200
        )
    }
)
        
    
}


module.exports = CategoryController