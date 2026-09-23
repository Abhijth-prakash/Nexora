const AdminUserService = require("../../services/AdminUserService");
const BaseController = require("../baseController");


class AdminUserController extends BaseController{

static getUsers = BaseController.asyncHandler(
    async (req, res) => {

        const id = req.AdminId
        const page = req.query.page

        const result = await AdminUserService.getUsers(id, page)

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
}



module.exports = AdminUserController