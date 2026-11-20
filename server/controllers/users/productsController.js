const UserproductService = require("../../services/UserproductService");
const { ReviewValidation,GetReviewsValidation } = require("../../utils/validation");
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



//creatingReview
static createReview = BaseController.asyncHandler(async (req, res) => {
  const userId = req.userId;

   const data = BaseController.validateRequest(ReviewValidation, req.body);

  const newReview = await UserproductService.createReview(userId, data);

  BaseController.logAction(
    `Review ${newReview._id} created by user ${userId} for product ${data.productId}`
  );

  return this.sendSuccessResponse(
    res,
    "Review added successfully",
    newReview,
    201
  );
});



//getReviews
static getReviews = BaseController.asyncHandler(async (req, res) => {
  const { productId, variantId, page, limit } = BaseController.validateRequest(
    GetReviewsValidation,
    req.query
  );
  

  const result = await UserproductService.getReviews(productId, {
    variantId: variantId || null,
    page,
    limit,
  });

  BaseController.logAction(
    `Fetched reviews for product ${productId} (page ${page})`
  );
   
  return this.sendSuccessResponse(
    res,
    "Reviews fetched successfully",
    result,
    200
  );
});

}


module.exports = ProductsController