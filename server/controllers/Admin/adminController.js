const Admin = require('../../models/Admin')
const Adminservice = require("../../services/Adminservice");
const BaseController = require('../baseController');



class AdminController extends BaseController{

    static login = BaseController.asyncHandler(
        async(req,res)=>{
            console.log('adminlogin got a req')
        }
    )

}


module.exports = AdminController