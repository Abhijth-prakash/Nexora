const AdminUserService = require("../../services/AdminUserService");
const BaseController = require("../baseController");


class AdminUserController extends BaseController{


//get all users
static getUsers = BaseController.asyncHandler(
    async (req, res) => {

        const id = req.AdminId
        const page = req.query.page
        const search = req.query.search
        const filter = req.query.filter

        const result = await AdminUserService.getUsers(id, page,search,filter)

        BaseController.sendSuccessResponse(
            res,
            "Fetched users successfully",
            {
                data: result
            },
            200
        )
    }
)

//block user

static blockUser = BaseController.asyncHandler(
  async (req, res) => {
    const id = req.AdminId
    const { userId } = req.body

    const result = await AdminUserService.blockUser(id, userId)

     BaseController.logAction(`User ${result.userName} blocked successfully by ${result.email}`);

    BaseController.sendSuccessResponse(
      res,
      `User ${result.userName} blocked successfully by ${result.email}`,
      null,
      200
    )
  }
)

//unblock

static unblockUser = BaseController.asyncHandler(
    async (req,res)=>{
        const id = req.AdminId
        const {userId} = req.body

         const result = await AdminUserService.unblockUser(id, userId)

     BaseController.logAction(`User ${result.userName} unblocked successfully by ${result.email}`);

    BaseController.sendSuccessResponse(
      res,
      `User ${result.userName} unblocked successfully by ${result.email}`,
      null,
      200
    )
    }
)
}



module.exports = AdminUserController